/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

interface FileTypeDefinition {
  name: string;
  extensions: string[];
  mimeType: string;
}

export const FileType = {
  Json: { name: "JSON", extensions: ["json"], mimeType: "application/json" },
} satisfies Record<string, FileTypeDefinition>;
export type FileType = (typeof FileType)[keyof typeof FileType];
