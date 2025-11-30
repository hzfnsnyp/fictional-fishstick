/**
 * Simple Focus Detection - Lock State on Focus
 * Determines focus ring visibility at focus time and locks it until blur
 */

(function() {
  'use strict';

  let lastInteractionWasKeyboard = false;
  
  // Store focus state for each element to prevent typing from changing it
  const elementFocusStates = new WeakMap();

  // Keys that indicate keyboard navigation (not typing)
  const keyboardNavigationKeys = new Set([
    'Tab', 'Enter', 'Escape', 'Space',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
  ]);

  function handleKeyDown(e) {
    // Only navigation keys change the interaction mode
    if (keyboardNavigationKeys.has(e.key)) {
      lastInteractionWasKeyboard = true;
    }
    // Typing keys (letters, numbers, backspace, etc.) don't change the mode
  }

  function handlePointer() {
    lastInteractionWasKeyboard = false;
  }

  function handleFocus(e) {
    const element = e.target;
    
    // Remove existing focus-visible class
    element.classList.remove('focus-visible');
    element.removeAttribute('data-focus-visible-added');

    // Determine if focus ring should show based on CURRENT interaction mode
    const shouldShowFocusRing = lastInteractionWasKeyboard;
    
    // Lock this decision for this element until it loses focus
    elementFocusStates.set(element, shouldShowFocusRing);

    if (shouldShowFocusRing) {
      element.classList.add('focus-visible');
      element.setAttribute('data-focus-visible-added', '');
    }
  }

  function handleBlur(e) {
    const element = e.target;
    
    // Clean up
    element.classList.remove('focus-visible');
    element.removeAttribute('data-focus-visible-added');
    elementFocusStates.delete(element);
  }

  function initialize() {
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handlePointer, true);
    document.addEventListener('pointerdown', handlePointer, true);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    document.body.classList.add('custom-focus-system');
    
    console.log('Simple focus detection with locked states initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Debug utilities
  window.FocusDebug = {
    getLastInteraction: () => lastInteractionWasKeyboard ? 'keyboard' : 'mouse',
    getElementState: (element) => elementFocusStates.get(element)
  };

})();