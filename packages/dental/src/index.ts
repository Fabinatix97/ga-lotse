/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export { ExaminationStatusChip } from "./components/examination/ExaminationStatusChip";

export { type Child, mapChild } from "./features/children/api/models/Child";
export {
  type ChildDetails,
  mapChildDetails,
} from "./features/children/api/models/ChildDetails";
export {
  type PersonDetails,
  mapPersonDetails,
} from "./features/children/api/models/PersonDetails";
export {
  type ProphylaxisSessionExamination,
  mapProphylaxisSessionExamination,
} from "./features/prophylaxisSessions/api/models/ProphylaxisSessionExamination";
export {
  type ChildSearchResult,
  mapChildSearchResult,
} from "./features/children/api/models/ChildSearchResult";

export {
  type ChildExamination,
  mapChildExamination,
} from "./features/children/api/models/ChildExamination";
export {
  type AbsenceExaminationResult,
  type ExaminationResult,
  type ExaminationResultWithDate,
  type FluoridationExaminationResult,
  type ScreeningExaminationResult,
  type ToothDiagnoses,
  mapExaminationResult,
} from "./api/models/ExaminationResult";
export {
  type ExaminationStatus,
  mapToExaminationStatus,
} from "./api/models/ExaminationStatus";
export { type Institution, mapInstitution } from "./api/models/Institution";
export {
  type AnnualInstitution,
  mapAnnualInstitution,
} from "./api/models/AnnualInstitution";
export {
  type ProphylaxisSession,
  mapProphylaxisSession,
} from "./features/prophylaxisSessions/api/models/ProphylaxisSession";
export {
  type ProphylaxisSessionDetails,
  mapProphylaxisSessionDetails,
} from "./features/prophylaxisSessions/api/models/ProphylaxisSessionDetails";
export {
  type ToothDiagnosis,
  mapToothDiagnosis,
} from "./api/models/ToothDiagnosis";

export {
  useUpdateAnnualChild,
  useUpdateAnnualChildPerson,
  useSyncPerson,
  useUpdateExamination,
} from "./features/children/api/mutations/details";
export {
  useCloseSchoolYear,
  useCreateChild,
  useImportChildren,
} from "./features/children/api/mutations/overview";
export { useCreateProphylaxisSession } from "./features/prophylaxisSessions/api/mutations/overview";
export {
  useDeleteProphylaxisSessionParticipantOptions,
  useUpdateProphylaxisSession,
  useUpdateProphylaxisSessionExaminations,
  useUpdateProphylaxisSessionParticipants,
} from "./features/prophylaxisSessions/api/mutations/details";
export {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "./config/apiQueryKeys";
export {
  getChildrenByPersonQuery,
  useGetChildrenQuery,
  useSearchChildren,
  useSearchInstitutionGroups,
} from "./features/children/api/queries/overview";
export {
  getChildDetailsQuery,
  getExaminationQuery,
} from "./features/children/api/queries/details";
export { useGetProphylaxisSessions } from "./features/prophylaxisSessions/api/queries/overview";
export {
  getProphylaxisSessionQuery,
  getAllDentalAssistantsQuery,
  getAllDentistsQuery,
} from "./features/prophylaxisSessions/api/queries/details";

export { EXAMINATION_STATUS } from "./translations/examination";
export { PROPHYLAXIS_TYPES } from "./translations/prophylaxisSession";

export { routes } from "./config/routes";
export { RELATED_TEETH } from "./config/teeth";

export { DentalProvider, useDentalApi } from "./contexts/dental";

export { DentalChildLayout } from "./features/children/layouts/DentalChildLayout";
export { useChildRouteParams } from "./features/children/hooks/useChildRouteParams";
export { DentalChildExaminationRouteParams } from "./features/children/schemas/DentalChildExaminationRouteParams";
export { DentalChildRouteParams } from "./features/children/schemas/DentalChildRouteParams";
export { AnnualInstitutionsTable } from "./features/children/components/AnnualInstitutionsTable";
export { DentalChildExaminationsPage } from "./features/children/pages/DentalChildExaminationsPage";

export { moduleUserGroup } from "./config/moduleUserGroup";
export {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "./config/progressEntries";
export { resolveSideNavigationItems } from "./config/sideNavigationItem";
