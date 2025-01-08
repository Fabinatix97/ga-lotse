/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Validator } from "@eshg/lib-portal/types/form";

import { useTranslation } from "@/lib/i18n/client";
import { FileType } from "@/lib/types/FileType";

export interface FileLike {
  type: File["type"];
}

export function useValidateFileType(
  acceptedFileTypes: FileType[],
  locale: string,
): Validator<FileLike | null> {
  const { t } = useTranslation();
  return (file) => {
    if (
      file === null ||
      acceptedFileTypes.length === 0 ||
      acceptedFileTypes.some((fileType) => file.type === fileType.mimeType)
    ) {
      return undefined;
    }

    const disjunctionList = new Intl.ListFormat(locale, {
      style: "short",
      type: "disjunction",
    });
    const acceptedFiles = acceptedFileTypes.map((fileType) => fileType.name);
    const formattedFiles = disjunctionList.format(acceptedFiles);
    return `${t("hint", { fileType: formattedFiles })}`;
  };
}
