/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Validator } from "@eshg/lib-portal/types/form";
import { isString } from "remeda";

import { FileType } from "@/lib/shared/components/formFields/file/FileType";

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
