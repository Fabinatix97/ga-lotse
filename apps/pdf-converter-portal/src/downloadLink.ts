/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// @ts-expect-error Typescript doesn't know about global variables from IDs
const downloadLink = window['download-link'] as HTMLAnchorElement;

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  downloadLink.setAttribute("href", url);
  downloadLink.setAttribute("download", file.name);
  downloadLink.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 150);
}
