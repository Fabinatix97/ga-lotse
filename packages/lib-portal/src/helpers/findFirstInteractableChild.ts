/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function findFirstInteractableChild(
  element: Element,
): HTMLElement | null {
  const selector = `
        a[href],
        button:not(:disabled),
        input:not(:disabled),
        select:not(:disabled),
        textarea:not(:disabled),
        [tabindex]:not([tabindex="-1"]),
        [onclick]
    `;

  return element.querySelector<HTMLElement>(selector);
}
