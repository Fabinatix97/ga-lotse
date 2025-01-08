/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isString } from "remeda";

import { Validator } from "../../../types/form";

import { FileType } from "./FileType";

export interface FileLike {
  type: File["type"];
}

export function validateFileType(
  acceptedFileTypes: FileType[],
  locale: string,
): Validator<FileLike | null> {
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

    const disjunctionList = new Intl.ListFormat(locale, {
      style: "short",
      type: "disjunction",
    });
    const acceptedFiles = acceptedFileTypes.map((fileType) => fileType.name);
    const formattedFiles = disjunctionList.format(acceptedFiles);
    return `Bitte eine Datei vom Typ ${formattedFiles} auswählen.`;
  };
}
