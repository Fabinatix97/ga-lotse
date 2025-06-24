/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-expect-error Typescript doesn't know about global variables from IDs
const dropAreaInner = window['drop-area'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const processingIndicator = window['processing-indicator'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const processingError = window['processing-error'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const dismissError = window['dismiss-error'] as HTMLButtonElement;

export function setIdle() {
  dropAreaInner.classList.remove('hidden');
  processingIndicator.classList.add('hidden');
  processingError.classList.add('hidden');
}

export function setProgressSpinner() {
  dropAreaInner.classList.add('hidden');
  processingIndicator.classList.remove('hidden');
  processingError.classList.add('hidden');
}

export function setError() {
  dropAreaInner.classList.add('hidden');
  processingIndicator.classList.add('hidden');
  processingError.classList.remove('hidden');
}

export function initState() {
  dismissError.addEventListener('click', setIdle);
}
