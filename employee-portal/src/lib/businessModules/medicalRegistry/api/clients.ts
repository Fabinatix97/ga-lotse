/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApprovalRequestApi,
  Configuration,
  FileApi,
  MedicalRegistryApi,
  MedicalRegistryImportApi,
  ProcedureApi,
  ProgressEntryApi,
} from "@eshg/employee-portal-api/medicalRegistry";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

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
