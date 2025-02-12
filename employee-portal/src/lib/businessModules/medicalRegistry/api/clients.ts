/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  ApprovalRequestApi,
  ArchivingApi,
  Configuration,
  FileApi,
  MedicalRegistryApi,
  MedicalRegistryImportApi,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/medical-registry-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
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
