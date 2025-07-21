/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-expect-error Typescript doesn't know about global variables from IDs
const dropArea = window['drop-area'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const processingIndicator = window['processing-indicator'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const processingSuccess = window['processing-success'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const processingError = window['processing-error'] as HTMLDivElement;

// @ts-expect-error Typescript doesn't know about global variables from IDs
const info = window['info-idle'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const infoSuccess = window['info-success'] as HTMLDivElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const infoError = window['info-error'] as HTMLDivElement;

// @ts-expect-error Typescript doesn't know about global variables from IDs
const dismissError = window['dismiss-error'] as HTMLButtonElement;

export function setIdle() {
  dropArea.classList.remove('hidden');
  processingIndicator.classList.add('hidden');
  processingSuccess.classList.add('hidden');
  processingError.classList.add('hidden');

  info.classList.remove('hidden');
  infoSuccess.classList.add('hidden');
  infoError.classList.add('hidden');
}

export function setProgressSpinner() {
  dropArea.classList.add('hidden');
  processingIndicator.classList.remove('hidden');
  processingSuccess.classList.add('hidden');
  processingError.classList.add('hidden');

  info.classList.remove('hidden');
  infoSuccess.classList.add('hidden');
  infoError.classList.add('hidden');
}

export function setSuccess() {
  dropArea.classList.add('hidden');
  processingIndicator.classList.add('hidden');
  processingSuccess.classList.remove('hidden');
  processingError.classList.add('hidden');

  info.classList.add('hidden');
  infoSuccess.classList.remove('hidden');
  infoError.classList.add('hidden');
}

export function setError() {
  dropArea.classList.add('hidden');
  processingIndicator.classList.add('hidden');
  processingSuccess.classList.add('hidden');
  processingError.classList.remove('hidden');

  info.classList.add('hidden');
  infoSuccess.classList.add('hidden');
  infoError.classList.remove('hidden');
}

export function initState() {
  dismissError.addEventListener('click', setIdle);
}
