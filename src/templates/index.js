import { lazy } from 'react';

/**
 * Template registry.
 * Each entry is a lazy-loaded module that exports:
 *   { HomePage, ProductDetailPage, CartPage, CheckoutPage, OrderHistoryPage, LoginPage, RegisterPage }
 *
 * To add a new template:
 *   1. Create src/templates/mytemplate/index.js with those exports
 *   2. Add one entry here
 *   Zero changes elsewhere.
 */
const registry = {
  minimal: lazy(() => import('./minimal/index.js')),
  bold:    lazy(() => import('./bold/index.js')),
  elegant: lazy(() => import('./elegant/index.js')),
};

/**
 * Returns the lazy component set for a given templateName.
 * Falls back to 'minimal' if the name is unknown.
 */
export function getTemplate(templateName) {
  if (registry[templateName]) {
    return registry[templateName];
  }
  console.warn(
    `[ryzzlab] Unknown template "${templateName}" — falling back to "minimal"`
  );
  return registry.minimal;
}

export default registry;
