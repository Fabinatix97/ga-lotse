/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiGender } from "@eshg/sti-protection-api";

import { useTranslation } from "@/lib/i18n/client";

export function useGenderOptions() {
  const { t } = useTranslation(["stiProtection/forms"]);

  const genderNames = {
    [ApiGender.Diverse]: t("gender.diverse"),
    [ApiGender.Female]: t("gender.female"),
    [ApiGender.Male]: t("gender.male"),
    [ApiGender.NotSpecified]: t("gender.not_specified"),
  } satisfies Record<ApiGender, string>;

  return buildEnumOptions(genderNames);
}
