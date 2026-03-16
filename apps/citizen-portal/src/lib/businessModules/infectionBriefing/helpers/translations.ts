/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInfectionBriefingSalutation,
  ApiSalutation,
} from "@eshg/infection-briefing-api";
import { EnumMap, buildEnumOptions } from "@eshg/lib-portal";

import { TranslateFn } from "@/lib/i18n/client";

function translateMap<TEnum extends string>(
  t: TranslateFn,
  valueToLabelMap: Record<TEnum, string>,
) {
  const entries = Object.entries(valueToLabelMap)
    .filter((entry): entry is [TEnum, string] => typeof entry[1] === "string")
    .map(([value, label]: [TEnum, string]) => [value, t(label)]);
  return Object.fromEntries(entries) as Record<TEnum, string>;
}

const salutationNames: EnumMap<ApiInfectionBriefingSalutation> = {
  [ApiInfectionBriefingSalutation.NotSpecified]:
    "base/translation:salutation.not_specified",
  [ApiInfectionBriefingSalutation.Neutral]:
    "base/translation:salutation.neutral",
  [ApiInfectionBriefingSalutation.Male]: "base/translation:salutation.male",
  [ApiInfectionBriefingSalutation.Female]: "base/translation:salutation.female",
};

export function salutationOptions(t: TranslateFn) {
  return buildEnumOptions<ApiSalutation>(translateMap(t, salutationNames));
}
