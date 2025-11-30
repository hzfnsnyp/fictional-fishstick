const SPACING_TOKENS = [
  'spacing-8',
  'spacing-12',
  'spacing-16',
  'spacing-20',
  'spacing-24',
  'spacing-28',
  'spacing-32',
  'spacing-40',
  'spacing-48',
  'spacing-56',
  'spacing-64',
  'spacing-80',
  'spacing-96',
  'spacing-128',
];

const DIRECTIONS = [
  { prop: 'marginTop', label: 'mt' },
  { prop: 'marginRight', label: 'mr' },
  { prop: 'marginBottom', label: 'mb' },
  { prop: 'marginLeft', label: 'ml' },
  { prop: 'paddingTop', label: 'pt' },
  { prop: 'paddingRight', label: 'pr' },
  { prop: 'paddingBottom', label: 'pb' },
  { prop: 'paddingLeft', label: 'pl' },
];

const TOLERANCE = 0.6; // px
const DEBUG_CLASS = 'debug-spacing';

let active = false;
let domObserver = null;
let htmlObserver = null;
let scheduledFrame = null;
let cachedTokenValues = null;

function convertToPx(value, rootFontSize) {
  const raw = value.trim();
  if (!raw) return 0;

  if (raw.endsWith('rem')) {
    return parseFloat(raw) * rootFontSize;
  }
  if (raw.endsWith('px')) {
    return parseFloat(raw);
  }
  const numeric = parseFloat(raw);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getTokenValues() {
  if (cachedTokenValues) return cachedTokenValues;
  const rootStyles = getComputedStyle(document.documentElement);
  const fontSize = parseFloat(rootStyles.fontSize) || 16;

  cachedTokenValues = SPACING_TOKENS.reduce((map, token) => {
    const raw = rootStyles.getPropertyValue(`--${token}`) || '';
    map[token] = convertToPx(raw, fontSize);
    return map;
  }, {});

  return cachedTokenValues;
}

function findMatchingToken(pxValue) {
  const tokenValues = getTokenValues();
  let match = null;
  let bestDelta = TOLERANCE;

  for (const [token, tokenPx] of Object.entries(tokenValues)) {
    if (tokenPx <= 0) continue;
    const delta = Math.abs(Math.abs(pxValue) - tokenPx);
    if (delta <= bestDelta) {
      bestDelta = delta;
      match = token;
    }
  }

  return match;
}

function annotateElement(element) {
  const computed = getComputedStyle(element);
  const matches = [];

  DIRECTIONS.forEach(({ prop, label }) => {
    const value = parseFloat(computed[prop]);
    if (!value) return;
    const token = findMatchingToken(value);
    if (token) {
      matches.push({ context: label, token });
    }
  });

  if (matches.length) {
    const label = matches
      .map(({ context, token }) => `${context}:${token.replace('spacing-', '')}`)
      .join('  ');

    element.setAttribute('data-spacing-label', label);
    element.setAttribute('data-spacing-primary', matches[0].token);
  } else if (element.hasAttribute('data-spacing-label')) {
    element.removeAttribute('data-spacing-label');
    element.removeAttribute('data-spacing-primary');
  }
}

function annotateDocument() {
  if (!active) return;
  cachedTokenValues = null; // refresh tokens (handles responsive rem changes)

  const candidates = document.body ? document.body.querySelectorAll('*') : [];
  candidates.forEach((element) => {
    // Skip html/body tags
    if (element === document.documentElement || element === document.body) return;
    annotateElement(element);
  });
}

function scheduleAnnotate() {
  if (!active) return;
  if (scheduledFrame) cancelAnimationFrame(scheduledFrame);
  scheduledFrame = requestAnimationFrame(() => {
    scheduledFrame = null;
    annotateDocument();
  });
}

function clearAnnotations() {
  document
    .querySelectorAll('[data-spacing-label]')
    .forEach((el) => {
      el.removeAttribute('data-spacing-label');
      el.removeAttribute('data-spacing-primary');
    });
}

function enableDebug() {
  if (active) return;
  active = true;
  scheduleAnnotate();

  if (!domObserver) {
    domObserver = new MutationObserver(scheduleAnnotate);
    domObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener('resize', scheduleAnnotate);
}

function disableDebug() {
  if (!active) return;
  active = false;

  if (scheduledFrame) {
    cancelAnimationFrame(scheduledFrame);
    scheduledFrame = null;
  }

  if (domObserver) {
    domObserver.disconnect();
    domObserver = null;
  }

  window.removeEventListener('resize', scheduleAnnotate);
  clearAnnotations();
}

function handleHtmlClassMutation() {
  const shouldEnable = document.documentElement.classList.contains(DEBUG_CLASS);
  if (shouldEnable) {
    enableDebug();
  } else {
    disableDebug();
  }
}

export function setupSpacingDebug() {
  if (typeof window === 'undefined') return;

  if (!htmlObserver) {
    htmlObserver = new MutationObserver(handleHtmlClassMutation);
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  // Initial state check (e.g., if class already present)
  handleHtmlClassMutation();

  // Recompute on page show (e.g., back-forward cache)
  window.addEventListener('pageshow', () => {
    if (document.documentElement.classList.contains(DEBUG_CLASS)) {
      enableDebug();
      scheduleAnnotate();
    }
  });
}
