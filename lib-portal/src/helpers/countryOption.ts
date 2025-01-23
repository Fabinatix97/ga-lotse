/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode } from "@eshg/base-api";
import { isDefined } from "remeda";

import { SelectOption } from "../components/formFields/SelectOptions";

const customCodes = [ApiCountryCode.Unknown, ApiCountryCode.Stateless];
type CustomCode = (typeof customCodes)[number];

function isCustomCode(countryCode: string): countryCode is CustomCode {
  return (customCodes as string[]).includes(countryCode);
}

const customTranslation = {
  de: {
    UNKNOWN: "Unbekanntes Land",
    STATELESS: "Staatenlos",
  } satisfies Record<CustomCode, string>,
  en: {
    UNKNOWN: "Unknown Country",
    STATELESS: "Stateless",
  } satisfies Record<CustomCode, string>,
};

class RegionDisplayNames {
  private readonly displayNames: Intl.DisplayNames;
  private readonly customNames: (typeof customTranslation)["de" | "en"];

  constructor(locale: string) {
    this.displayNames = new Intl.DisplayNames(locale, { type: "region" });
    this.customNames = locale.startsWith("de")
      ? customTranslation.de
      : customTranslation.en;
  }

  of(countryCode: string): string {
    return isCustomCode(countryCode)
      ? this.customNames[countryCode]
      : (this.displayNames.of(countryCode) ?? countryCode);
  }
}

function getRegionLocale(locale: string) {
  return new RegionDisplayNames(locale);
}

export function countryOptions(
  locale = "de-DE",
): SelectOption<ApiCountryCode>[] {
  const translation = getRegionLocale(locale);
  const options = Array.from(Object.values(ApiCountryCode))
    .map((value) => ({
      value,
      label: translation.of(value),
    }))
    .filter(({ label }) => isDefined(label));
  options.sort(({ label: a }, { label: b }) => a.localeCompare(b));
  return options;
}

export function translateCountry(countryCode: string, locale = "de-DE") {
  const translation = getRegionLocale(locale);
  return translation.of(countryCode);
}
