/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessRestrictionApi,
  AppointmentBlockApi,
  AppointmentBookingApi,
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  DraftProtectionProcedureApi,
  FileApi,
  GdprValidationTaskApi,
  InboxProcedureApi,
  MeaslesProtectionAppointmentStandardDurationApi,
  MeaslesProtectionFeatureTogglesApi,
  MeaslesProtectionProcedureApi,
  MonetaryFineApi,
  ProcedureApi,
  ProgressEntryApi,
  ProofRequestLetterApi,
  ProofSubmissionApi,
  StatusTransitionApi,
} from "@eshg/measles-protection-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

export function useConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_MEASLES_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useFeatureTogglesApi() {
  const configuration = useConfiguration();
  return new MeaslesProtectionFeatureTogglesApi(configuration);
}

export function useProcedureApi() {
  const config = useConfiguration();
  return new ProcedureApi(config);
}

export function useProtectionProcedureApi() {
  const config = useConfiguration();
  return new MeaslesProtectionProcedureApi(config);
}

export function useAccessRestrictionApi() {
  const config = useConfiguration();
  return new AccessRestrictionApi(config);
}

export function useMonetaryFineApi() {
  const config = useConfiguration();
  return new MonetaryFineApi(config);
}

export function useProofSubmissionApi() {
  const config = useConfiguration();
  return new ProofSubmissionApi(config);
}

export function useProofRequestLetterApi() {
  const config = useConfiguration();
  return new ProofRequestLetterApi(config);
}

export function useDraftProcedureApi() {
  const config = useConfiguration();
  return new DraftProtectionProcedureApi(config);
}

export function useProgressEntryApi() {
  const config = useConfiguration();
  return new ProgressEntryApi(config);
}

export function useFileApi() {
  const config = useConfiguration();
  return new FileApi(config);
}

export function useAppointmentBookingApi() {
  return new AppointmentBookingApi(useConfiguration());
}

export function useAppointmentBlockApi() {
  const configuration = useConfiguration();
  return new AppointmentBlockApi(configuration);
}

export function useAppointmentStandardDurationsApi() {
  const configuration = useConfiguration();
  return new MeaslesProtectionAppointmentStandardDurationApi(configuration);
}

export function useInboxProcedureApi() {
  const configuration = useConfiguration();
  return new InboxProcedureApi(configuration);
}

export function useStatusTransitionApi() {
  const configuration = useConfiguration();
  return new StatusTransitionApi(configuration);
}

export function useApprovalRequestApi() {
  const configuration = useConfiguration();
  return new ApprovalRequestApi(configuration);
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}

export function useGdprValidationTaskApi() {
  const configuration = useConfiguration();
  return new GdprValidationTaskApi(configuration);
}
