/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { SupportedLanguage } from "@/lib/i18n/options";
import { useGivenLang } from "@/lib/i18n/useLang";
import { accessCodeRoute } from "@/lib/shared/helpers/accessCode";

export function citizenRoutes(locale: SupportedLanguage | undefined) {
  return defineRoutes(
    `${baseRoutes(locale).citizenPath.index}/impfberatung`,
    (travelMedicinePath) => ({
      overview: travelMedicinePath("/"),
      appointment: travelMedicinePath("/termin"),
      viewAppointment: defineRoutes(
        travelMedicinePath("/meine-termine"),
        (appointmentPath) => ({
          index: accessCodeRoute(appointmentPath("/")),
          details: defineRoutes(appointmentPath("/details"), (detailsPath) => ({
            index: accessCodeRoute(detailsPath("/")),
            medicalHistory: accessCodeRoute(detailsPath("/anamnese")),
            rebook: accessCodeRoute(detailsPath("/buchen")),
          })),
        }),
      ),
    }),
  );
}

export type CitizenRoutes = ReturnType<typeof citizenRoutes>;

export function useCitizenRoutes() {
  const locale = useGivenLang();
  return citizenRoutes(locale);
}
