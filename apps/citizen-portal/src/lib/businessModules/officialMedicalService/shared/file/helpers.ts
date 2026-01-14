/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal";
import { ApiOmsFile } from "@eshg/official-medical-service-api";

import { FileDescriptor } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { useTranslation } from "@/lib/i18n/client";

export function toArray<T>(value: T | T[] | undefined): T[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function fileToFileDescriptor(
  file: File,
  helperText?: string,
): FileDescriptor {
  return {
    name: file.name,
    size: file.size,
    fileType: mimeTypeToTypeName(file.type),
    creationDate: new Date(file.lastModified),
    helperText,
  };
}

export function mapFileTypeForOmsFile(file: ApiOmsFile) {
  return {
    ...file,
    type: typeNameToMimeType(file.fileType),
  };
}

function mimeTypeToTypeName(mimeType: string): string {
  return (
    Object.values(FileType).find((type) => type.mimeType === mimeType)?.name ??
    ""
  );
}

function typeNameToMimeType(name: string): string | string[] {
  return (
    Object.values(FileType).find((type) => type.name === name)?.mimeType ?? ""
  );
}

export function useMapToFrontendErrorMessage() {
  const { t } = useTranslation(["officialMedicalService/document"]);

  return function resolve(backendErrorMessage: string) {
    if (backendErrorMessage === "Invalid file name") {
      return t("document.validation.invalidFileName");
    }
    if (backendErrorMessage.startsWith("File name too long")) {
      return t("document.validation.fileNameTooLong");
    }
    if (backendErrorMessage === "Invalid file extension") {
      return t("document.validation.unsupportedFileType");
    }
    if (
      backendErrorMessage ===
      "Uploaded pdf did not pass conformance level check"
    ) {
      return t("document.validation.nonConformPdf");
    }
    if (backendErrorMessage === "File type is not supported") {
      return t("document.validation.unsupportedFileType");
    }
    if (backendErrorMessage.startsWith("Unsupported file type:")) {
      return t("document.validation.unsupportedFileType");
    }
    if (
      backendErrorMessage.startsWith("The image is too wide:") &&
      backendErrorMessage.indexOf(",") > 36
    ) {
      const size = backendErrorMessage.substring(35).split(",")[0];
      return t("document.validation.imageTooWide", {
        maximumSize: size,
      });
    }
    if (
      backendErrorMessage.startsWith("Mismatched media type; given in header:")
    ) {
      return t("document.validation.mismatchedMediaType");
    }
    return t("document.validation.unknownError");
  };
}
