/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResourceKey } from "i18next";

const localeLoader: Record<string, () => Promise<ResourceKey>> = {
  de: () => import("./locales/de").then((module) => module.de),
  en: () => import("./locales/en").then((module) => module.en),
};

export async function loadLocale(language: string): Promise<ResourceKey> {
  const loader = localeLoader[language];
  if (loader === undefined) {
    throw new Error(`Locale ${language} not found`);
  }
  return loader();
}
