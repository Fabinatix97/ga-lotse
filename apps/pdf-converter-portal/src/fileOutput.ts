/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {setIdle} from "@/setState";

// @ts-expect-error Typescript doesn't know about global variables from IDs
const downloadLink = window['download-link'] as HTMLAnchorElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const fileOutputButton = window['file-output-button'] as HTMLButtonElement;

export function setOutputFile(file: File) {
  const old_url = downloadLink.getAttribute("href");
  if (old_url) URL.revokeObjectURL(old_url);
  downloadLink.setAttribute("href", URL.createObjectURL(file));
  downloadLink.setAttribute("download", file.name);
}

export function initFileOutput() {
  fileOutputButton.addEventListener('click', () => {
    downloadLink.click();
    setIdle();
  });
}
