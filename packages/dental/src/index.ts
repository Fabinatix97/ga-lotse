/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

export { routes } from "./config/routes";
export { resolveSideNavigationItems } from "./config/sideNavigationItem";
export { moduleUserGroup } from "./config/userGroups";
export { DentalProvider } from "./contexts/dental";
export { DENTAL_MODULE_NAME } from "./translations/businessModule";

export { DentalProphylaxisSessionExaminationPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionExaminationPage";
export { DentalProphylaxisSessionDetailsPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionDetailsPage";
export {
  DentalProphylaxisSessionLayout,
  DentalProphylaxisSessionError,
} from "./features/prophylaxisSessions/layouts/DentalProphylaxisSessionLayout";

export { DentalProphylaxisSessionsOverviewPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionsOverviewPage";

export { DentalChildLayout } from "./features/children/layouts/DentalChildLayout";
export { DentalChildExaminationsOverviewPage } from "./features/children/pages/DentalChildExaminationsOverviewPage";
export { DentalChildDetailsPage } from "./features/children/pages/DentalChildDetailsPage";
export { DentalChildrenOverviewPage } from "./features/children/pages/DentalChildrenOverviewPage";
export { SchoolYearTransitionButton } from "./features/children/components/childrenOverview/tableButtons";
export { SchoolYearTransitionSchoolPage } from "./features/children/pages/SchoolYearTransitionSchoolPage";
export { SchoolYearTransitionGroupPage } from "./features/children/pages/SchoolYearTransitionGroupPage";
export { SchoolYearTransitionDaycarePage } from "./features/children/pages/SchoolYearTransitionDaycarePage";
export { SchoolYearTransitionChildrenPage } from "./features/children/pages/SchoolYearTransitionChildrenPage";
export { DentalChildExaminationPage } from "./features/children/pages/DentalChildExaminationPage";
export { DentalSyncPersonPage } from "./features/children/pages/DentalSyncPersonPage";

export { DentalChildProgressEntriesPage } from "./features/children/pages/DentalChildProgressEntriesPage";

export { DentalProcedureLabelsOverviewPage } from "./features/procedureLabels/pages/DentalProcedureLabelsOverviewPage";

export { DentalArchivePage } from "./pages/DentalArchivePage";
export { DentalArchiveAdminPage } from "./pages/DentalArchiveAdminPage";
