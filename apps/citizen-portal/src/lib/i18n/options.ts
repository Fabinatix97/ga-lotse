/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InitOptions } from "i18next";

import {
  i18nNamespace as i18nNamespaceLibPortal,
  loadLocale as loadLocaleLibPortal,
} from "@eshg/lib-portal";

export const defaultLang = "de";
export const supportedLanguages = ["en", "de"] as const;
export const options = {
  // debug: true,
  supportedLngs: supportedLanguages,
  fallbackNS: "translation",
  defaultNS: "translation",
  saveMissing: true,
  missingKeyHandler: (
    lngs,
    ns,
    key,
    _fallbackValue,
    _updateMissing,
    _options,
  ) => {
    const message = `Key not found: "${ns}:${key}" in translation "${lngs[0]}"`;
    // It will show an error,
    // but you can still see the page in dev mode which makes it easier to debug
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error(message);
      return;
    }
    throw new Error(message);
  },
} as const satisfies InitOptions<unknown>;

export type SupportedLanguage = (typeof options.supportedLngs)[number];

const defaultModule = "base";

export function resourceResolver(language: string, namespace: string) {
  if (namespace === i18nNamespaceLibPortal) {
    return loadLocaleLibPortal(language);
  }

  return loadLocaleCitizenPortal(language, namespace);
}

function loadLocaleCitizenPortal(language: string, namespace: string) {
  const parts = namespace.split("/");
  const firstPart = parts[0];
  const subNamespace = parts.at(-1);
  const moduleName = firstPart === namespace ? defaultModule : firstPart;

  const modulePath =
    moduleName === defaultModule
      ? `baseModule`
      : `businessModules/${moduleName}`;
  return import(`../${modulePath}/locales/${language}/${subNamespace}.json`);
}
