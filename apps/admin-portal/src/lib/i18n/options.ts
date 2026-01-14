/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InitOptions } from "i18next";

export const options: InitOptions<unknown> = {
  // debug: true,
  detection: {
    order: ["localStorage"],
    caches: ["localStorage"],
  },
  preload: [],
  supportedLngs: ["en", "de"],
  fallbackLng: "en",
  fallbackNS: "translation",
  defaultNS: "translation",
};

export function resourceResolver(language: string, namespace: string) {
  return import(`./locales/${language}/${namespace}.json`);
}
