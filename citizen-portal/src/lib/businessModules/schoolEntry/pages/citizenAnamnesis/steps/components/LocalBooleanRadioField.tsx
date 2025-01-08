/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BooleanRadioField,
  BooleanRadioGroupFieldProps,
} from "@eshg/lib-portal/components/formFields/BooleanRadioField";

import { useTranslation } from "@/lib/i18n/client";

export function LocalBooleanRadioField(
  props: Omit<BooleanRadioGroupFieldProps, "trueLabel" | "falseLabel">,
) {
  const { t } = useTranslation("schoolEntry/anamnesis");
  return (
    <BooleanRadioField {...props} trueLabel={t("yes")} falseLabel={t("no")} />
  );
}
