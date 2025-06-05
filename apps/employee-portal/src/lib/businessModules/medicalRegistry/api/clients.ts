/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  GdprValidationTaskApi,
  MedicalRegistryApi,
  MedicalRegistryImportApi,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/medical-registry-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

export function useConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_MEDICAL_REGISTRY_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useMedicalRegistryApi() {
  const configuration = useConfiguration();
  return new MedicalRegistryApi(configuration);
}

export function useMedicalRegistryImportApi() {
  const configuration = useConfiguration();
  return new MedicalRegistryImportApi(configuration);
}

export function useProcedureApi() {
  const configuration = useConfiguration();
  return new ProcedureApi(configuration);
}

export function useApprovalRequestApi() {
  const configuration = useConfiguration();
  return new ApprovalRequestApi(configuration);
}

export function useFileApi() {
  const configuration = useConfiguration();
  return new FileApi(configuration);
}

export function useProgressEntryApi() {
  const configuration = useConfiguration();
  return new ProgressEntryApi(configuration);
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}

export function useGdprValidationTaskApi() {
  const configuration = useConfiguration();
  return new GdprValidationTaskApi(configuration);
}
