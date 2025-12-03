# Spacing System Documentation

## Overview

This project uses a comprehensive spacing system to manage vertical rhythm and prevent spacing conflicts between global typography styles and component-specific layouts.

## Problem

Global typography styles (`_typography.css`) apply automatic margins to all HTML elements:
- `h2 { margin-bottom: 20px }` (desktop) / `32px` (mobile)
- `h3 { margin-bottom: 20px }` (desktop) / `32px` (mobile)
- `p { margin-bottom: 32px }`

These can conflict with component-specific spacing needs, causing duplicate spacing issues.

## Solutions

### 1. Reset Typography Spacing Utility

**Class:** `.reset-typography-spacing`

**Purpose:** Complete control over spacing by removing all default typography margins

**Use case:**
- Legal pages (Privacy Policy, Terms of Use)
- Custom card layouts
- Complex nested structures
- Any layout where you need explicit margin control

**Example:**
```html
<article class="privacy-article reset-typography-spacing">
  <h2 class="article__title">Heading</h2>
  <p class="article__text">Content</p>
</article>
```

```css
.article__title {
  margin-bottom: 16px; /* Only this margin applies */
}

.article__text {
  margin-bottom: 24px; /* Only this margin applies */
}
```

**What it does:**
- Resets `margin-top: 0` and `margin-bottom: 0` for all typography elements
- Applies to: `h1, h2, h3, h4, h5, h6, p, ul, ol, li`

### 2. Prose Class for Rich Text Content

**Class:** `.prose`

**Purpose:** Natural typography spacing for readable content

**Use case:**
- Blog posts
- Articles
- CMS-generated content
- Documentation

**Example:**
```html
<div class="prose">
  <h2>Article Title</h2>
  <p>Paragraph with automatic spacing...</p>
  <h3>Subsection</h3>
  <p>More content...</p>
  <ul>
    <li>List item</li>
  </ul>
</div>
```

**Spacing provided:**
- `> * + *`: 24px between elements (20px mobile)
- `h2`: 48px top, 20px bottom (32px/16px mobile)
- `h3`: 32px top, 16px bottom (24px/12px mobile)
- `p, ul, ol`: 20px bottom

## When to Use Which Approach

### Use `.reset-typography-spacing` when:
- ✅ You need full control over every spacing value
- ✅ Building complex layouts with nested structures
- ✅ Creating legal/policy pages with specific spacing requirements
- ✅ Global typography margins would cause conflicts

### Use `.prose` when:
- ✅ Displaying rich text content from CMS
- ✅ Creating blog posts or articles
- ✅ Natural reading flow is important
- ✅ You want automatic, sensible spacing between elements

### Use neither when:
- ✅ Component has its own complete spacing system
- ✅ Using card/grid layouts with internal gap controls
- ✅ Default typography margins work perfectly

## Section Padding System

The project also uses a **Section Padding System** for container-level spacing:

### Available Classes:

```css
section {
  --section-padding-block: var(--spacing-64); /* Default */
}

.section-pad-none { --section-padding-block: 0; }
.section-pad-compact { --section-padding-block: var(--spacing-32); }
.section-pad-comfort { --section-padding-block: var(--spacing-48); }
.section-pad-loose { --section-padding-block: var(--spacing-96); }
```

## Flow System

For consistent vertical spacing between sibling elements:

```css
.flow > * + * {
  margin-top: var(--flow-space, var(--gap-block));
}

/* Modifiers: */
.flow-xs { --flow-space: var(--spacing-16); }
.flow-sm { --flow-space: var(--spacing-24); }
.flow-md { --flow-space: var(--spacing-32); }
.flow-lg { --flow-space: var(--spacing-48); }
.flow-xl { --flow-space: var(--spacing-64); }
.flow-xxl { --flow-space: var(--spacing-96); }
```

## 8px Grid System

All spacing values are multiples of 8px:
- `--spacing-8`: 8px
- `--spacing-12`: 12px (1.5×)
- `--spacing-16`: 16px (2×)
- `--spacing-20`: 20px (2.5×)
- `--spacing-24`: 24px (3×)
- `--spacing-32`: 32px (4×)
- `--spacing-40`: 40px (5×)
- `--spacing-48`: 48px (6×)
- `--spacing-64`: 64px (8×)
- `--spacing-96`: 96px (12×)

## Best Practices

1. **Always use spacing variables** - Never hardcode pixel values
2. **One source of truth** - Either component controls spacing OR global styles, not both
3. **Mobile-first** - Consider mobile spacing in media queries
4. **Document edge cases** - Comment why specific spacing is needed
5. **Test isolation** - Ensure components work independently

## Migration Guide

If you encounter spacing conflicts in existing components:

1. **Identify the conflict:**
   - Inspect element in DevTools
   - Check for duplicate margins from multiple sources

2. **Choose appropriate solution:**
   - Need full control? → Add `.reset-typography-spacing`
   - Natural reading content? → Add `.prose`
   - Custom component? → Use explicit margins in component CSS

3. **Remove manual overrides:**
   - Delete inline `margin: 0` overrides
   - Remove component-level typography resets
   - Let utility classes handle it

4. **Test thoroughly:**
   - Check desktop and mobile
   - Verify spacing matches design
   - Ensure no visual regressions

## Examples

### Privacy Policy (Custom Layout)

```html
<article class="privacy-article reset-typography-spacing">
  <h2 class="privacy-article__title">Section Title</h2>
  <p class="privacy-article__lead">Lead paragraph</p>
  <section class="privacy-subsection">
    <h3>Subsection</h3>
    <p>Content...</p>
  </section>
</article>
```

```css
.privacy-article__title { margin-bottom: 16px; }
.privacy-article__lead { margin-bottom: 24px; }
.privacy-subsection { margin-bottom: 24px; }
```

### Blog Post (Natural Spacing)

```html
<article class="prose">
  <h1>Post Title</h1>
  <p>Introduction paragraph...</p>
  <h2>Section</h2>
  <p>Content with automatic spacing...</p>
  <ul>
    <li>Point one</li>
    <li>Point two</li>
  </ul>
</article>
```

## References

- `src/styles/base/_utilities.css` - Utility classes
- `src/styles/base/_typography.css` - Global typography
- `src/styles/base/_layout.css` - Section & Flow systems
- `src/styles/base/_variables.css` - Spacing tokens
