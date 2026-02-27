/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

export { routes } from "./config/routes";
export { resolveSideNavigationItems } from "./config/sideNavigationItem";

export {
  InfectionBriefingApiClientProvider as InfectionBriefingProvider,
  useInfectionBriefingApiClients,
} from "./contexts/InfectionBriefingApi";

export { InfectionBriefingOverviewPage } from "./pages/InfectionBriefingOverviewPage";
export { InfectionBriefingAppointmentBlockOverviewPage } from "./pages/InfectionBriefingAppointmentBlockOverviewPage";
export { InfectionBriefingNewAppointmentBlockGroupsPage } from "./pages/InfectionBriefingNewAppointmentBlockGroupsPage";
