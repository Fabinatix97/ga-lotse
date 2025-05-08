/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

export {
  CuspidIcon,
  IncisorIcon,
  MolarIcon,
  PremolarIcon,
} from "./components/fullDentition/toothIcons";

export {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "./config/apiQueryKeys";
export { DentalProphylaxisSessionExaminationPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionExaminationPage";
export { DentalProphylaxisSessionDetailsPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionDetailsPage";
export {
  DentalProphylaxisSessionLayout,
  DentalProphylaxisSessionError,
} from "./features/prophylaxisSessions/layouts/DentalProphylaxisSessionLayout";
export { DentalProphylaxisSessionsOverviewPage } from "./features/prophylaxisSessions/pages/DentalProphylaxisSessionsOverviewPage";

export { routes } from "./config/routes";

export { DentalProvider, useDentalApi } from "./contexts/dental";

export { DentalChildLayout } from "./features/children/layouts/DentalChildLayout";
export { useChildRouteParams } from "./features/children/hooks/useChildRouteParams";
export { DentalChildRouteParams } from "./features/children/schemas/DentalChildRouteParams";
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

export { DentalProcedureLabelsOverviewPage } from "./features/procedureLabels/pages/DentalProcedureLabelsOverviewPage";

export { moduleUserGroup } from "./config/userGroups";
export {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "./config/progressEntries";
export { resolveSideNavigationItems } from "./config/sideNavigationItem";
export { childApiQueryKey } from "./config/apiQueryKeys";
