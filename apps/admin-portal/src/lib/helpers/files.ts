/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

function getFileHandle(suggestedName: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const showSaveFilePicker: (options: {
    suggestedName: string;
    types: { accept: Record<string, string[]> }[];
    // @ts-expect-error: showSaveFilePicker
  }) => FileSystemFileHandle = window.showSaveFilePicker;
  return showSaveFilePicker({
    suggestedName,
    types: [{ accept: { "application/json": [".json"] } }],
  });
}

async function saveDownload5(
  suggestedName: string,
  downloadPromise: () => Blob,
) {
  const [newHandle, fileBlob] = [
    getFileHandle(suggestedName),
    downloadPromise(),
  ];

  const writableStream = await newHandle.createWritable();
  await writableStream.write(fileBlob);
  await writableStream.close();
}

function saveDownloadLegacy(
  suggestedName: string,
  downloadPromise: () => Blob,
) {
  const fileBlob = downloadPromise();
  const tempAnchor = document.createElement("a");
  const url = URL.createObjectURL(fileBlob);
  tempAnchor.href = url;
  tempAnchor.download = suggestedName;
  tempAnchor.click();
  window.URL.revokeObjectURL(url);
}

export async function saveDownload(
  suggestedName: string,
  download: () => Blob,
) {
  try {
    return window.hasOwnProperty("showSaveFilePicker")
      ? saveDownload5(suggestedName, download)
      : saveDownloadLegacy(suggestedName, download);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Fetched error for saveDownload():", error);
  }
}
