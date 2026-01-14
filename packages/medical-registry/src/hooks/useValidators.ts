/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from "react";

import { Validator, useTranslation, validateRegex } from "@eshg/lib-portal";

const lifetimeDoctorNumberRegex = new RegExp(/^\d{9}$/);

function validateLifetimeDoctorNumber(message: string): Validator<string> {
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
