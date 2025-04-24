/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { ApiOmsFile } from "@eshg/official-medical-service-api";

import { FileDescriptor } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { TranslateFn } from "@/lib/i18n/client";

export function toArray<T>(value: T | T[] | undefined): T[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function fileToFileDescriptor(file: File): FileDescriptor {
  return {
    name: file.name,
    size: file.size,
    fileType: mimeTypeToTypeName(file.type),
    creationDate: new Date(file.lastModified),
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

export function mapToFrontendErrorMessage(
  t: TranslateFn,
  backendErrorMessage: string,
) {
  if (backendErrorMessage === "Invalid file name") {
    return t("documents.validation.invalidFileName");
  }
  if (backendErrorMessage === "Invalid file extension") {
    return t("documents.validation.unsupportedFileType");
  }
  if (
    backendErrorMessage === "Uploaded pdf did not pass conformance level check"
  ) {
    return t("documents.validation.nonConformPdf");
  }
  if (backendErrorMessage === "File type is not supported") {
    return t("documents.validation.unsupportedFileType");
  }
  if (backendErrorMessage.startsWith("Unsupported file type:")) {
    return t("documents.validation.unsupportedFileType");
  }
  if (
    backendErrorMessage.startsWith("The image is too wide:") &&
    backendErrorMessage.indexOf(",") > 36
  ) {
    const size = backendErrorMessage.substring(35).split(",")[0];
    return t("documents.validation.imageTooWide", {
      maximumSize: size,
    });
  }
  if (
    backendErrorMessage.startsWith("Mismatched media type; given in header:")
  ) {
    return t("documents.validation.mismatchedMediaType");
  }
  return t("documents.validation.unknownError");
}
