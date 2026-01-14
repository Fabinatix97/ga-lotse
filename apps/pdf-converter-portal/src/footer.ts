/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-expect-error Typescript doesn't know about global variables from IDs
const imprint = window['imprint-link'] as HTMLButtonElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const privacy = window['privacy-link'] as HTMLButtonElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const accessibility = window['accessibility-link'] as HTMLButtonElement;

export function initFooter() {
  document.querySelectorAll(".back-to-main").forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.main').forEach((el) => el.classList.remove('invisible'));
      document.querySelectorAll('.imprint').forEach((el) => el.classList.add('invisible'));
      document.querySelectorAll('.privacy').forEach((el) => el.classList.add('invisible'));
      document.querySelectorAll('.accessibility').forEach((el) => el.classList.add('invisible'));
    });
  });
  imprint.addEventListener("click", () => {
    document.querySelectorAll('.main').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.imprint').forEach((el) => el.classList.remove('invisible'));
    document.querySelectorAll('.privacy').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.accessibility').forEach((el) => el.classList.add('invisible'));
  });
  privacy.addEventListener("click", () => {
    document.querySelectorAll('.main').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.imprint').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.privacy').forEach((el) => el.classList.remove('invisible'));
    document.querySelectorAll('.accessibility').forEach((el) => el.classList.add('invisible'));
  });
  accessibility.addEventListener("click", () => {
    document.querySelectorAll('.main').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.imprint').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.privacy').forEach((el) => el.classList.add('invisible'));
    document.querySelectorAll('.accessibility').forEach((el) => el.classList.remove('invisible'));
  });
}
