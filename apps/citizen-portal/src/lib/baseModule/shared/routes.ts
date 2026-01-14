/**
 * Copyright 2026 cronn GmbH
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
      bundIdPortal: {
        overview: `${citizenPath}/mein-bereich/datenschutzrechte`,
        profile: `${citizenPath}/mein-bereich/profil`,
      },
    },
    organizationPath: {
      index: organizationPath,
      mukPortal: {
        overview: `${organizationPath}/mein-bereich/datenschutzrechte`,
        profile: `${organizationPath}/mein-bereich/profil`,
      },
    },
    imprint: `${localePath}/impressum`,
    privacyPolicy: `${localePath}/datenschutz`,
    data_privacy_rights: `${localePath}/datenschutzrechte`,
    accessibility: `${localePath}/barrierefreiheit`,
    termsOfUse: `${localePath}/nutzungshinweise`,
    openData: `${localePath}/opendata`,
    contact: `${localePath}/kontakt`,
  } as const;
}

export function useRoutes() {
  const locale = useGivenLang();
  return routes(locale);
}
