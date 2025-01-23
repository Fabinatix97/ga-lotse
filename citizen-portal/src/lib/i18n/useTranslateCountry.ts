/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode } from "@eshg/citizen-portal-api/base";
import {
  countryOptions,
  translateCountry,
} from "@eshg/lib-portal/helpers/countryOption";
import { useMemo } from "react";

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
