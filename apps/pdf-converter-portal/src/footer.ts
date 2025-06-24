/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-expect-error Typescript doesn't know about global variables from IDs
const footerClose = window['footer-close'] as HTMLButtonElement;

const footer = document.querySelector('footer')!;

export function initFooter() {
  document.querySelectorAll(".footer-link").forEach((el, i) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.footer-text')
      .forEach((el, j) => j === i ? el.classList.remove('invisible') : el.classList.add('invisible'));

      if (el === footerClose) {
        footerClose.classList.add('hidden');
        footer.classList.add('collapsed');
      } else {
        footerClose.classList.remove('hidden');
        footer.classList.remove('collapsed');
      }
    });
  });
}
