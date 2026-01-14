/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";

import { ApiCountryCode } from "@eshg/base-api";
import { countryOptions, translateCountry } from "@eshg/lib-portal";

import { useLocale } from "@/lib/i18n/useLocale";

export function useTranslateCountry() {
  const locale = useLocale();
  return useMemo(
    () => ({
      translateCountry: (countryCode: ApiCountryCode) =>
        translateCountry(countryCode as string, locale.code),
      countryOptions: () => countryOptions(locale.code),
    }),
    [locale],
  );
}
