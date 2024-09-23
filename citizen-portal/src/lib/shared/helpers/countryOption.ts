/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode } from "@eshg/citizen-portal-api/travelMedicine";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { isDefined } from "remeda";

function getRegionLocale(locale: string) {
  return new Intl.DisplayNames(locale, { type: "region" });
}

export function countryOptions(locale = "de-DE"): SelectOption[] {
  const translation = getRegionLocale(locale);
  const options = Array.from(Object.values(ApiCountryCode))
    .map((value) => ({
      value,
      label: translation.of(value),
    }))
    .filter(({ label }) => isDefined(label)) as SelectOption[];
  options.sort(({ label: a }, { label: b }) => a.localeCompare(b));
  return options;
}

export function translateCountry(countryCode: string, locale = "de-DE") {
  const translation = getRegionLocale(locale);
  return translation.of(countryCode) ?? countryCode;
}
