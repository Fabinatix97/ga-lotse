/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export type LOCALE_OPTION = "auto" | "manual";

interface AutoLocale {
  localeOption: "auto";
}
interface ManualLocale {
  localeOption: "manual";
  locale: string;
}

export function formatCurrency(
  fee: number | undefined,
  option: AutoLocale | ManualLocale,
) {
  if (!fee) {
    return;
  }
  if (option.localeOption === "manual") {
    return Intl.NumberFormat(option.locale, {
      style: "currency",
      currency: "EUR",
    }).format(fee);
  } else {
    const browserLocale = navigator.language;
    return Intl.NumberFormat(browserLocale, {
      style: "currency",
      currency: "EUR",
    }).format(fee);
  }
}
