/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/universal";
import { ApiConcern } from "@eshg/sti-protection-api";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";
import { accessCodeRoute } from "@/lib/shared/helpers/accessCode";

function citizenRoutes(locale: SupportedLanguage | undefined) {
  return defineRoutes(
    `${baseRoutes(locale).citizenPath.index}/sexuelle-gesundheit`,
    (stiProtectionPath) => ({
      sexWork: defineRoutes(stiProtectionPath("/sexarbeit"), (path) => ({
        index: path("/"),
        bookAppointment: path("/termin-buchen"),
      })),
      stiConsultation: defineRoutes(
        stiProtectionPath("/sti-beratung"),
        (path) => ({
          index: path("/"),
          bookAppointment: path("/termin-buchen"),
        }),
      ),
      resultsStatus: stiProtectionPath("/ergebnisstatus"),
      personalArea: defineRoutes(
        stiProtectionPath("/mein-bereich"),
        (path) => ({
          index: accessCodeRoute(path("/")),
          appointments: path("/termine"),
          rebook: path("/termin-umbuchen"),
          anamnesis: path("/anamnesebogen"),
          resultsStatus: path("/ergebnisstatus"),
          pin: path("/pin"),
        }),
      ),
    }),
  );
}

export function useCitizenRoutes() {
  const locale = useGivenLang();
  return citizenRoutes(locale);
}

export function useConcernedCitizenRoutes(concern?: ApiConcern) {
  const routes = useCitizenRoutes();
  const concernPath =
    concern === ApiConcern.SexWork ? "sexWork" : "stiConsultation";
  return {
    concernPath: routes[concernPath],
    personalArea: routes.personalArea,
  };
}
