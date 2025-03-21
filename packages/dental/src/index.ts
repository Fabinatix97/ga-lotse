/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export { type Child, mapChild } from "./api/models/Child";
export {
  type ChildDetails,
  mapChildDetails,
  mapPersonDetails,
  mapPersonDetailsToForm,
  type PersonDetails,
} from "./api/models/ChildDetails";
export {
  type ChildExamination,
  mapChildExamination,
} from "./api/models/ChildExamination";
export {
  type ChildSearchResult,
  mapChildSearchResult,
} from "./api/models/ChildSearchResult";

export { type Examination, mapExamination } from "./api/models/Examination";
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
export {
  type AnnualInstitution,
  type Institution,
  mapAnnualInstitutionDetails,
  mapInstitution,
} from "./api/models/Institution";
export {
  type ProphylaxisSession,
  mapProphylaxisSession,
} from "./api/models/ProphylaxisSession";
export {
  type ProphylaxisSessionDetails,
  mapProphylaxisSessionDetails,
} from "./api/models/ProphylaxisSessionDetails";
export {
  type ToothDiagnosis,
  mapToothDiagnosis,
} from "./api/models/ToothDiagnosis";

export {
  useCloseSchoolYear,
  useCreateChild,
  useUpdateAnnualChild,
  useUpdateAnnualChildPerson,
  useSyncPerson,
  useUpdateExamination,
} from "./api/mutations/childApi";
export { useImportChildren } from "./api/mutations/importApi";
export {
  useCreateProphylaxisSession,
  useDeleteProphylaxisSessionParticipantOptions,
  useUpdateProphylaxisSession,
  useUpdateProphylaxisSessionExaminations,
  useUpdateProphylaxisSessionParticipants,
} from "./api/mutations/prophylaxisSessionApi";
export {
  fileApiQueryKey,
  progressEntryApiQueryKey,
} from "./api/queries/apiQueryKeys";
export {
  getChildrenByPersonQuery,
  getChildDetailsQuery,
  getExaminationQuery,
  useGetChildrenQuery,
  useSearchChildren,
  useSearchInstitutionGroups,
} from "./api/queries/childApi";
export {
  getProphylaxisSessionQuery,
  useGetProphylaxisSessions,
} from "./api/queries/prophylaxisSessionApi";
export {
  getAllDentalAssistantsQuery,
  getAllDentistsQuery,
} from "./api/queries/staffApi";

export { routes } from "./config/routes";
export { RELATED_TEETH } from "./config/teeth";

export { DentalProvider, useDentalApi } from "./contexts/dental";

export { DentalChildLayout } from "./features/children/layouts/DentalChildLayout";
export { useChildRouteParams } from "./features/children/hooks/useChildRouteParams";
export { DentalChildExaminationRouteParams } from "./features/children/schemas/DentalChildExaminationRouteParams";
export { DentalChildRouteParams } from "./features/children/schemas/DentalChildRouteParams";

export { moduleUserGroup } from "./shared/moduleUserGroup";
export {
  keyDocumentTypes,
  systemProgressEntryTypeTitles,
} from "./shared/progressEntries";
export { resolveSideNavigationItems } from "./shared/sideNavigationItem";
