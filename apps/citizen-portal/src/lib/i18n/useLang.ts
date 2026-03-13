/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { getBaseTranslation } from "@/lib/baseModule/locales";

import { useTranslation } from "./client";
import { SupportedLanguage } from "./options";
import { parseLocaleFromPath } from "./parseLocaleFromPath";

export function useGivenLang(): SupportedLanguage | undefined {
  const pathname = usePathname();
  return parseLocaleFromPath(pathname);
}

export function useLang(): SupportedLanguage {
  const { i18n } = useTranslation();
  return i18n.language as SupportedLanguage;
}

export function useSwitchLanguage() {
  const { i18n } = useTranslation();
  return useCallback(
    async (update: SupportedLanguage, path: string) => {
      const pathname = window.location.pathname;
      if (pathname.startsWith(`/${update}`)) {
        return;
      }
      await i18n.changeLanguage(update);
      window.history.replaceState(null, "", path);

      // Here we update the title & language because that (and other metadata) are rendered on the server
      // However, most metadata is irrelevant to the user once the page is loaded, with the exceptions of page title
      // and the document language
      document.title = getBaseTranslation(update, "site_title");
      document.documentElement.lang = update;
    },
    [i18n],
  );
}
