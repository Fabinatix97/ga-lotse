/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useParams, usePathname } from "next/navigation";

import { SupportedLanguage, defaultLang } from "./options";
import { parseLocaleFromPath } from "./parseLocaleFromPath";

export function useGivenLang(): SupportedLanguage | undefined {
  const pathname = usePathname();
  return parseLocaleFromPath(pathname);
}

export function useLang(): SupportedLanguage {
  const { lang } = useParams<{ lang?: SupportedLanguage }>();
  return lang ?? defaultLang;
}
