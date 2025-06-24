/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {convertAndDownload} from "@/pdfToPdfa";

// @ts-expect-error Typescript doesn't know about global variables from IDs
const fileInput = window['file-input'] as HTMLInputElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const fileInputButton = window['file-input-button'] as HTMLButtonElement;

export function initFileInput() {
  fileInput.addEventListener('change', () => {
    if (!fileInput.files?.length) {
      return;
    }
    void convertAndDownload(fileInput.files)
    fileInput.value = ""
  });
  fileInputButton.addEventListener('click', () => {
    fileInput.click();
  });
}
