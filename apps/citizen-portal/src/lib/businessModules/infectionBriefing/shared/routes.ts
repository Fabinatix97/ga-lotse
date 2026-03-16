/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";
import { accessCodeRoute } from "@/lib/shared/helpers/accessCode";

function citizenRoutes(locale: SupportedLanguage | undefined) {
  return defineRoutes(
    `${baseRoutes(locale).citizenPath.index}/lebensmittelausweis`,
    (infectionBriefingPath) => ({
      overview: infectionBriefingPath("/"),
      bookAppointment: infectionBriefingPath("/termin-buchen"),
      personalArea: defineRoutes(
        infectionBriefingPath("/mein-bereich"),
        (path) => ({
          index: accessCodeRoute(path("/")),
        }),
      ),
    }),
  );
}

export function useCitizenRoutes() {
  const locale = useGivenLang();
  return citizenRoutes(locale);
}
