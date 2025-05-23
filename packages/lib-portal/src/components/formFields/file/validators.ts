/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isEmpty, isNullish, isString } from "remeda";

import { Validator } from "../../../types/form";

import { FileLike, FileType } from "./types";

export function validateFileType({
  acceptedFileTypes,
  message,
}: {
  acceptedFileTypes: FileType[];
  message: string;
}): Validator<FileLike | null> {
  return (file) => {
    if (
      file === null ||
      acceptedFileTypes.length === 0 ||
      acceptedFileTypes.some((fileType) =>
        isString(fileType.mimeType)
          ? file.type === fileType.mimeType
          : fileType.mimeType.includes(file.type),
      )
    ) {
      return undefined;
    }

    return message;
  };
}

export function validateFile({
  acceptedExtensions,
  maxFileSize,
  messages,
}: {
  acceptedExtensions?: string[];
  maxFileSize?: number;
  messages: {
    invalidName: string;
    nameTooLong: string;
    invalidExtension: string;
    tooLarge: string;
  };
}): Validator<File | null> {
  function validateFile(file: File | null) {
    if (isNullish(file)) return undefined;
    if (!fileNameIsValid(file)) return messages.invalidName;
    if (fileNameIsTooLong(file)) return messages.nameTooLong;
    if (!fileHasAcceptedExtension(file, acceptedExtensions))
      return messages.invalidExtension;
    if (fileIsTooLarge(file, maxFileSize)) return messages.tooLarge;
    return undefined;
  }

  return validateFile;
}

export function validateFileName(existingFileName?: string) {
  function validateFileName(fileName: string) {
    if (isEmpty(fileName)) return undefined;

    const file = new File([], fileName);
    if (!fileNameIsValid(file))
      return "Bitte einen gültigen Dateinamen auswählen.";
    if (fileNameIsTooLong(file))
      return "Bitte einen kürzeren Dateinamen auswählen.";
    if (
      existingFileName !== undefined &&
      fileExtensionChanged(file, existingFileName)
    ) {
      return `Die ursprüngliche Dateiendung (.${getExtensionFromFileName(existingFileName)}) darf nicht verändert werden.`;
    }
    return undefined;
  }

  return validateFileName;
}

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
