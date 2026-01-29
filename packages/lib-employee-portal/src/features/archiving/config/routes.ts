/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineRoutes } from "@eshg/lib-portal/universal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

type BusinessModuleRoutes = Record<ApiBusinessModule, string>;

export const archivingRoutes = defineRoutes("/archiving", (archivingRoute) => ({
  module: {
    [ApiBusinessModule.Inspection]: archivingRoute("/inspection"),
    [ApiBusinessModule.MeaslesProtection]: archivingRoute(
      "/measles-protection",
    ),
    [ApiBusinessModule.MedicalRegistry]: archivingRoute("/medical-registry"),
    [ApiBusinessModule.OfficialMedicalService]: archivingRoute(
      "/official-medical-service",
    ),
    [ApiBusinessModule.SchoolEntry]: archivingRoute("/school-entry"),
    [ApiBusinessModule.Dental]: archivingRoute("/dental"),
    [ApiBusinessModule.TravelMedicine]: archivingRoute("/travel-medicine"),
    [ApiBusinessModule.StiProtection]: archivingRoute("/sti-protection"),
    [ApiBusinessModule.MedsAbroad]: archivingRoute("/meds-abroad"),
    [ApiBusinessModule.ProstituteProtection]: archivingRoute(
      "/prostitute-protection",
    ),
    [ApiBusinessModule.InfectionBriefing]: archivingRoute(
      "/infection-briefing",
    ),
  } satisfies BusinessModuleRoutes,
}));

export const archivingAdminRoutes = defineRoutes(
  "/archiving-admin",
  (archivingAdminRoute) => ({
    module: {
      [ApiBusinessModule.Inspection]: archivingAdminRoute("/inspection"),
      [ApiBusinessModule.MeaslesProtection]: archivingAdminRoute(
        "/measles-protection",
      ),
      [ApiBusinessModule.MedicalRegistry]:
        archivingAdminRoute("/medical-registry"),
      [ApiBusinessModule.OfficialMedicalService]: archivingAdminRoute(
        "/official-medical-service",
      ),
      [ApiBusinessModule.SchoolEntry]: archivingAdminRoute("/school-entry"),
      [ApiBusinessModule.Dental]: archivingAdminRoute("/dental"),
      [ApiBusinessModule.TravelMedicine]:
        archivingAdminRoute("/travel-medicine"),
      [ApiBusinessModule.StiProtection]: archivingAdminRoute("/sti-protection"),
      [ApiBusinessModule.MedsAbroad]: archivingAdminRoute("/meds-abroad"),
      [ApiBusinessModule.ProstituteProtection]: archivingAdminRoute(
        "/prostitute-protection",
      ),
      [ApiBusinessModule.InfectionBriefing]: archivingAdminRoute(
        "/infection-briefing",
      ),
    } satisfies BusinessModuleRoutes,
  }),
);
