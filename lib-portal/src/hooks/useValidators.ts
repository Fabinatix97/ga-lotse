/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";

import {
  validateEmail,
  validateLength,
  validatePastOrTodayDate,
} from "../helpers/validators";
import { useTranslation } from "../i18n/useTranslation";

export function useValidators() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      validateEmail: validateEmail(t("validation.email")),
      validateLength: (startInclusive: number, endInclusive: number) =>
        validateLength(
          startInclusive,
          endInclusive,
          t("validation.length", {
            startInclusive,
            endInclusive,
          }),
        ),
      validatePastOrTodayDate: validatePastOrTodayDate(
        t("validation.pastOrTodayDate"),
      ),
    }),
    [t],
  );
}
