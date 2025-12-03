/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

// Config
export { routes } from "./config/routes";
export { resolveSideNavigationItems } from "./config/sideNavigationItem";

// Contexts
export {
  ProstituteProtectionApiClientProvider as ProstituteProtectionProvider,
  useProstituteProtectionApiClients,
} from "./contexts/ProstituteProtectionApi";

// Pages
export { ProstituteProtectionNewAppointmentBlockGroupsPage } from "./pages/ProstituteProtectionNewAppointmentBlockGroupsPage";
export { ProstituteProtectionAppointmentBlockGroupsOverviewPage } from "./pages/ProstituteProtectionAppointmentBlockGroupsOverviewPage";
export { ProstituteProtectionOverviewPage } from "./pages/ProstituteProtectionOverviewPage";
export { ProstituteProtectionProgressEntriesPage } from "./pages/ProstituteProtectionProgressEntriesPage";
export { ProstituteProtectionProcedureDetailsPage } from "./pages/ProstituteProtectionProcedureDetailsPage";
export { ProstituteProtectionConsultationPage } from "./pages/ProstituteProtectionConsultationPage";

// Layouts
export { ProstituteProtectionProcedureLayout } from "./layouts/ProstituteProtectionProcedureLayout";
