/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

export { routes } from "./config/routes";
export { resolveSideNavigationItems } from "./config/sideNavigationItem";
export { moduleUserGroup } from "./config/userGroups";

export { DentalProvider } from "./contexts/dental";

export { SchoolYearTransitionButton } from "./features/children/components/childrenOverview/tableButtons";
export { DentalChildLayout } from "./features/children/layouts/DentalChildLayout";
export { DentalChildDetailsPage } from "./features/children/pages/DentalChildDetailsPage";
export { DentalChildExaminationPage } from "./features/children/pages/DentalChildExaminationPage";
export { DentalChildExaminationsOverviewPage } from "./features/children/pages/DentalChildExaminationsOverviewPage";
export { DentalChildProgressEntriesPage } from "./features/children/pages/DentalChildProgressEntriesPage";
export { DentalChildrenOverviewPage } from "./features/children/pages/DentalChildrenOverviewPage";
export { DentalSyncPersonPage } from "./features/children/pages/DentalSyncPersonPage";
export { SchoolYearTransitionChildrenPage } from "./features/children/pages/SchoolYearTransitionChildrenPage";
export { SchoolYearTransitionDaycarePage } from "./features/children/pages/SchoolYearTransitionDaycarePage";
export { SchoolYearTransitionGroupPage } from "./features/children/pages/SchoolYearTransitionGroupPage";
export { SchoolYearTransitionSchoolPage } from "./features/children/pages/SchoolYearTransitionSchoolPage";

export { DentalProcedureLabelsOverviewPage } from "./features/procedureLabels/pages/DentalProcedureLabelsOverviewPage";

export {
  DentalProphylaxisSessionError,
  DentalProphylaxisSessionLayout,
} from "./features/prophylaxisSessions/layouts/DentalProphylaxisSessionLayout";
export { DentalProphylaxisSessionDetailsPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionDetailsPage";
export { DentalProphylaxisSessionExaminationPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionExaminationPage";
export { DentalProphylaxisSessionsOverviewPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionsOverviewPage";

export { DentalArchiveAdminPage } from "./pages/DentalArchiveAdminPage";
export { DentalArchivePage } from "./pages/DentalArchivePage";

export { DENTAL_MODULE_NAME } from "./translations/businessModule";
