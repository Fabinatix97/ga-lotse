/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";

import { validateRegex } from "../../helpers/validators";
import { useTranslation } from "../../i18n/useTranslation";
import { Validator } from "../../types/form";

const lifetimeDoctorNumberRegex = new RegExp(/^\d{9}$/);

export function validateLifetimeDoctorNumber(
  message: string,
): Validator<string> {
  return (value: string) =>
    validateRegex(lifetimeDoctorNumberRegex, message)(value);
}

export function useValidateLifetimeDoctorNumber() {
  const { t } = useTranslation();

  return useMemo(
    () => validateLifetimeDoctorNumber(t("validation.lifetimeDoctorNumber")),
    [t],
  );
}
