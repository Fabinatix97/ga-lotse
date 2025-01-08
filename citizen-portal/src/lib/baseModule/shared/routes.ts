/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";

export function routes(locale: SupportedLanguage | undefined) {
  const localePath = locale ? `/${locale}` : "";
  const citizenPath = localePath;
  const organizationPath = `${localePath}/unternehmen`;

  return {
    index: "/",
    citizenPath: {
      index: citizenPath,
    },
    organizationPath: {
      index: organizationPath,
    },
    imprint: `${localePath}/impressum`,
    privacyPolicy: `${localePath}/datenschutz`,
    accessibility: `${localePath}/barrierefreiheit`,
    termsOfUse: `${localePath}/nutzungshinweise`,
    contact: `${localePath}/kontakt`,
  } as const;
}

export function useRoutes() {
  const locale = useGivenLang();
  return routes(locale);
}
