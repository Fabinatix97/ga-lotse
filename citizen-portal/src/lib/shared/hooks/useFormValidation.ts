/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { useMemo } from "react";

import { useTranslation } from "@/lib/i18n/client";

function useValidationErrors() {
  const { t } = useTranslation("validation");

  return useMemo(
    () => ({
      length: (startInclusive: number, endInclusive: number) =>
        t("length", {
          startInclusive,
          endInclusive,
        }),
    }),
    [t],
  );
}

export function useFormValidation() {
  const validationErrors = useValidationErrors();

  return useMemo(
    () => ({
      validateLength: (startInclusive: number, endInclusive: number) =>
        validateLength(startInclusive, endInclusive, validationErrors.length),
    }),
    [validationErrors],
  );
}
