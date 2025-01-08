/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LOCALE_OPTION {
  auto,
  manual,
}

interface AutoLocale {
  localOption: LOCALE_OPTION.auto;
}
interface ManualLocale {
  localOption: LOCALE_OPTION.manual;
  locale: string;
}

export function formatCurrency(
  fee: number | undefined,
  option: AutoLocale | ManualLocale,
) {
  if (!fee) {
    return;
  }
  if (option.localOption === LOCALE_OPTION.manual) {
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

export function safeIntOrUndefined(num: number): number | undefined {
  return Number.isSafeInteger(num) ? num : undefined;
}
