/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";
import { accessCodeRoute } from "@/lib/shared/helpers/accessCode";

function citizenRoutes(locale: SupportedLanguage | undefined) {
  return defineRoutes(
    `${baseRoutes(locale).citizenPath.index}/amtsaerztlicherdienst`,
    (officialMedicalServicePath) => ({
      overview: officialMedicalServicePath("/"),
      appointment: officialMedicalServicePath("/termin"),
      personalArea: defineRoutes(
        officialMedicalServicePath("/mein-bereich"),
        (appointmentPath) => ({
          index: accessCodeRoute(appointmentPath("/")),
          anamnesis: accessCodeRoute(appointmentPath("/anamnese")),
          rebook: accessCodeRoute(appointmentPath("/buchen")),
        }),
      ),
    }),
  );
}

export function useCitizenRoutes() {
  const locale = useGivenLang();
  return citizenRoutes(locale);
}
