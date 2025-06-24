/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {convertAndDownload} from "@/pdfToPdfa";

// @ts-expect-error Typescript doesn't know about global variables from IDs
const dropArea = window['drop-area'] as HTMLDivElement;

function validate(items?: DataTransferItemList): boolean {
  if (items?.length !== 1) {
    return false;
  }
  const item = items[0]!;
  return item.kind === 'file' && item.type === 'application/pdf';
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  if (!validate(e.dataTransfer?.items)) {
    e.dataTransfer!.dropEffect = 'none';
    dropArea.classList.remove('drag-copy');
    dropArea.classList.add('drag-none');
  } else {
    e.dataTransfer!.dropEffect = 'copy';
    dropArea.classList.add('drag-copy');
    dropArea.classList.remove('drag-none');
  }
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  dropArea.classList.remove('drag-copy');
  dropArea.classList.remove('drag-none');
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  dropArea.classList.remove('drag-copy');
  dropArea.classList.remove('drag-none');
  void convertAndDownload(e.dataTransfer?.files)
}

export function initDropArea() {
  dropArea.addEventListener('dragover', handleDragOver);
  dropArea.addEventListener('dragleave', handleDragLeave);
  dropArea.addEventListener('drop', handleDrop);
}
