/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";

import { FileDescriptor } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";

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

function mimeTypeToTypeName(mimeType: string): string {
  return (
    Object.values(FileType).find((type) => type.mimeType === mimeType)?.name ??
    ""
  );
}
