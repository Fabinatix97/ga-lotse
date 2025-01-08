/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/employee-portal-api/base";
import { useRef, useState } from "react";

import { useSnackbar } from "../../components/snackbar/SnackbarProvider";
import { getErrorMessage } from "../../errorHandling/errorMappers";
import { resolveError } from "../../errorHandling/errorResolvers";

export function useFileDownload<TParams = void>(
  downloadFn: (params: TParams) => Promise<ApiResponse<Blob>>,
) {
  const snackbar = useSnackbar();
  const downloadContainerRef = useRef<HTMLDivElement>(null);
  const [isPending, setIsPending] = useState(false);

  async function downloadWithPendingFn(
    params: TParams,
  ): Promise<ApiResponse<Blob>> {
    setIsPending(true);
    return await downloadFn(params).finally(() => setIsPending(false));
  }

  async function download(params: TParams): Promise<void> {
    try {
      const downloadContainer = downloadContainerRef.current;
      if (downloadContainer === null) {
        throw new Error("Download container is not initialized");
      }

      const response = await downloadWithPendingFn(params);
      const file = await parseBlobResponse(response);
      downloadFileAndOpen(file, downloadContainer);
    } catch (error) {
      const portalError = resolveError(error);
      snackbar.error(getErrorMessage(portalError.errorCode));
      throw error;
    }
  }

  async function preview(params: TParams): Promise<void> {
    try {
      const response = await downloadWithPendingFn(params);
      const file = await parseBlobResponse(response);
      downloadFileAndPreview(file);
    } catch (error) {
      const portalError = resolveError(error);
      snackbar.error(getErrorMessage(portalError.errorCode));
      throw error;
    }
  }

  return { downloadContainerRef, download, preview, isPending };
}

export async function parseBlobResponse(
  apiResponse: ApiResponse<Blob>,
): Promise<File> {
  const rawResponse = apiResponse.raw;
  if (!rawResponse.ok) {
    throw new Error("File could not be downloaded");
  }
  const blob = await rawResponse.blob();
  const resolvedFileName = getFilenameFromHeader(rawResponse) ?? "file";
  return new File([blob], resolvedFileName, {
    type: rawResponse.headers.get("Content-Type") ?? undefined,
  });
}

export function downloadFileAndOpen(
  file: File,
  downloadContainer: HTMLElement,
): void {
  const objectUrl = URL.createObjectURL(file);
  const hiddenLink = document.createElement("a");
  hiddenLink.setAttribute("tabindex", "-1");
  hiddenLink.setAttribute("aria-hidden", "true");
  hiddenLink.setAttribute("href", objectUrl);
  hiddenLink.setAttribute("download", file.name);
  downloadContainer.appendChild(hiddenLink);
  hiddenLink.click();
  URL.revokeObjectURL(objectUrl);
}

export function downloadFileAndPreview(file: File): void {
  const objectUrl = URL.createObjectURL(file);
  window.open(objectUrl, "_blank");
  URL.revokeObjectURL(objectUrl);
}

export function getFilenameFromHeader(response: Response): string | null {
  const content = response.headers.get("Content-Disposition");
  return parseContentDisposition(content);
}

/**
 * adapted from https://stackoverflow.com/a/67994693/1601438
 * Note: This method is exported to be able to test it
 */
export function parseContentDisposition(
  disposition: string | null,
): string | null {
  if (!disposition) return null;

  const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-.]+)(?:; ?|$)/i;
  const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

  if (utf8FilenameRegex.test(disposition)) {
    return decodeURIComponent(utf8FilenameRegex.exec(disposition)![1]!);
  } else {
    const filenameStart = disposition.toLowerCase().indexOf("filename=");
    if (filenameStart >= 0) {
      const partialDisposition = disposition.slice(filenameStart);
      const matches = asciiFilenameRegex.exec(partialDisposition);
      return matches?.[2] ?? null;
    }
  }
  return null;
}
