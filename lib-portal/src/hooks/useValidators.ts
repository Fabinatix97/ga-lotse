/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo } from "react";
import { isDefined } from "remeda";

import { formatFileSize } from "../components/formFields/file/helpers";
import { FileType } from "../components/formFields/file/types";
import {
  validateFile,
  validateFileType,
} from "../components/formFields/file/validators";
import {
  validateEmail,
  validateLength,
  validateNumber,
  validatePastOrTodayDate,
} from "../helpers/validators";
import { useTranslation } from "../i18n/useTranslation";

export function useValidateEmail() {
  const { t } = useTranslation();
  return useMemo(() => validateEmail(t("validation.email")), [t]);
}

export function useValidateLength() {
  const { t } = useTranslation();
  return useCallback(
    (startInclusive: number, endInclusive: number) =>
      validateLength(
        startInclusive,
        endInclusive,
        t("validation.length", {
          startInclusive,
          endInclusive,
        }),
      ),
    [t],
  );
}

export function useValidatePastOrTodayDate() {
  const { t } = useTranslation();
  return useMemo(
    () => validatePastOrTodayDate(t("validation.pastOrTodayDate")),
    [t],
  );
}

export function useValidateNumber() {
  const { t } = useTranslation();
  return useMemo(() => validateNumber(t("validation.number")), [t]);
}

export function useValidateFileType() {
  const { t } = useTranslation();
  return useCallback(
    (acceptedFileTypes: FileType[]) =>
      validateFileType({
        acceptedFileTypes,
        message: t("validation.file.wrongType", {
          types: acceptedFileTypes.map((fileType) => fileType.name),
        }),
      }),
    [t],
  );
}

export function useValidateFile() {
  const { t } = useTranslation();
  return useCallback(
    ({
      acceptedExtensions,
      maxFileSize,
    }: {
      acceptedExtensions?: string[];
      maxFileSize?: number;
    }) =>
      validateFile({
        acceptedExtensions,
        maxFileSize,
        messages: {
          invalidName: t("validation.file.invalidName"),
          nameTooLong: t("validation.file.nameTooLong"),
          invalidExtension: t("validation.file.invalidExtension"),
          tooLarge: t("validation.file.tooLarge", {
            maxFileSize: isDefined(maxFileSize) && formatFileSize(maxFileSize),
          }),
        },
      }),
    [t],
  );
}
