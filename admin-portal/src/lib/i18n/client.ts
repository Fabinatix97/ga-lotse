/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import i18next, {
  InitOptions,
  LanguageDetectorModule,
  Services,
} from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next, useTranslation } from "react-i18next";

import { options, resourceResolver } from "@/lib/i18n/options";

class LanguageDetector implements LanguageDetectorModule {
  type = "languageDetector" as const;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(_services?: Services, _options?: InitOptions): void {}

  detect(): string | string[] | undefined {
    if (typeof window === "undefined") {
      return Intl.DateTimeFormat().resolvedOptions().locale;
    }
    const language = window.localStorage.getItem("language");
    if (language != null) {
      return language;
    } else {
      return window.navigator.language;
    }
  }

  cacheUserLanguage(_lng: string, _caches?: string[]): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("language", _lng);
    }
  }
}

Object.defineProperty(LanguageDetector, "type", {
  value: "languageDetector",
  writable: false,
  enumerable: true,
  configurable: false,
});

const instance = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend(resourceResolver))
  .init(options);

void instance;

export { useTranslation };
