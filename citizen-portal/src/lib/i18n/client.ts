/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { TOptions, createInstance, type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { useCallback } from "react";
import {
  UseTranslationOptions,
  initReactI18next,
  useTranslation,
} from "react-i18next";

import {
  options,
  resourceResolver, // supportedLanguages,
} from "@/lib/i18n/options";

const cache: Record<string, i18n> = {};
export function getClient(lang: string) {
  const cacheHit = cache[lang];
  if (cacheHit) {
    return cacheHit;
  }
  const newClient = createClient(lang);
  cache[lang] = newClient;
  return newClient;
}

function createClient(lang: string) {
  const client = createInstance({
    ...options,
    lng: lang,
    fallbackLng: lang,
  })
    .use(initReactI18next)
    .use(resourcesToBackend(resourceResolver));

  void client.init();
  return client;
}
function useTranslationWrapper(
  ns?: string | string[],
  options?: UseTranslationOptions<undefined>,
) {
  const { t, i18n, ready } = useTranslation(ns, options);
  const tFunction = useCallback(
    (key: string | string[], tOptions?: TOptions) => {
      const firstKey = key instanceof Array ? key[0] : key;
      const nsIndex = firstKey?.indexOf(":") ?? -1;
      const ns = nsIndex >= 0 ? firstKey?.slice(0, nsIndex) : undefined;
      if (ns && !i18n.hasLoadedNamespace(ns)) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Promise((resolve) => {
          void i18n.loadNamespaces(ns, resolve);
        });
      }
      return t(key, tOptions);
    },
    [i18n, t],
  );
  return { t: tFunction, i18n, ready };
}
export type TranslateFn = ReturnType<typeof useTranslationWrapper>["t"];

export { useTranslationWrapper as useTranslation };
