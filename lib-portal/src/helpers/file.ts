/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function fileNameIsValid(file: File) {
  return /^([A-Za-z0-9\-_]+\.[A-Za-z0-9]+)$/.test(file.name);
}

export function fileNameIsTooLong(file: File) {
  return file.name.length > 128;
}

export function fileHasAcceptedExtension(
  file: File,
  acceptedFileExtensions?: string[],
) {
  if (acceptedFileExtensions === undefined) return true;
  return acceptedFileExtensions.includes(getExtensionFromFileName(file.name));
}

export function fileIsTooLarge(file: File, acceptedFileSize?: number) {
  if (acceptedFileSize === undefined) return false;

  // We substract 0.1MB in case the request header overhead pushes it over the limit
  return file.size > acceptedFileSize - (1024 * 1024) / 10;
}

export function formatFileSize(bytes: number) {
  const kilo = 1024;
  const mega = 1024 * 1024;
  if (bytes < mega) return `${(bytes / kilo).toFixed(1)} KB`;
  return `${(bytes / mega).toFixed(1)} MB`;
}

export function fileExtensionChanged(file: File, existingFileName: string) {
  if (existingFileName === undefined) return true;

  const existingFileExtension = getExtensionFromFileName(existingFileName);
  const fileExtension = getExtensionFromFileName(file.name);
  return existingFileExtension !== fileExtension;
}

export function getExtensionFromFileName(fileName: string) {
  const fileParts = fileName.split(".");
  if (fileParts.length < 2) return "";
  return fileParts.pop() ?? "";
}
