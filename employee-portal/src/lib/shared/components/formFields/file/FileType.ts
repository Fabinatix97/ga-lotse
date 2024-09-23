/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

interface FileTypeDefinition {
  name: string;
  extensions: string[];
  mimeType: string | string[];
}

export const FileType = {
  Eml: { name: "EML", extensions: ["eml"], mimeType: "message/rfc822" },
  Jpeg: { name: "JPEG", extensions: ["jpg", "jpeg"], mimeType: "image/jpeg" },
  Pdf: { name: "PDF", extensions: ["pdf"], mimeType: "application/pdf" },
  Png: { name: "PNG", extensions: ["png"], mimeType: "image/png" },
  Mp3: { name: "MP3", extensions: ["mp3"], mimeType: "audio/mpeg" },
  Wav: { name: "WAV", extensions: ["wav"], mimeType: "audio/wav" },
  Vcf: {
    name: "vCard",
    extensions: ["vcf"],
    mimeType: ["text/vcard", "text/x-vcard"],
  },
  Xlsx: {
    name: "XLSX",
    extensions: ["xlsx"],
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  Geojson: {
    name: "geojson",
    extensions: ["geojson", "json"],
    mimeType: ["application/json", ".geojson"],
  },
} satisfies Record<string, FileTypeDefinition>;
export type FileType = (typeof FileType)[keyof typeof FileType];
