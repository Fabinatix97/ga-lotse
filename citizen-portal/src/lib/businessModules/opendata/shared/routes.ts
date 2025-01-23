/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";

function citizenRoutes(locale: SupportedLanguage | undefined) {
  return defineRoutes(
    `${baseRoutes(locale).citizenPath.index}/opendata`,
    (openDataPath) => ({
      overview: openDataPath("/"),
      termsOfUse: openDataPath("/nutzungsbedingungen"),
      byId: (externalId: string) => openDataPath(`/${externalId}`),
    }),
  );
}

export type CitizenRoutes = ReturnType<typeof citizenRoutes>;

export function useCitizenRoutes() {
  const locale = useGivenLang();
  return citizenRoutes(locale);
}
