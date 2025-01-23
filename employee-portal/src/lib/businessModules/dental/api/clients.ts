/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApprovalRequestApi,
  ChildApi,
  Configuration,
  FileApi,
  ProcedureApi,
  ProgressEntryApi,
  ProphylaxisSessionApi,
} from "@eshg/dental-api";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_DENTAL_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useChildApi() {
  const configuration = useConfiguration();
  return new ChildApi(configuration);
}

export function useProphylaxisSessionApi() {
  const configuration = useConfiguration();
  return new ProphylaxisSessionApi(configuration);
}

export function useProcedureApi() {
  const configuration = useConfiguration();
  return new ProcedureApi(configuration);
}

export function useProgressEntryApi() {
  const configuration = useConfiguration();
  return new ProgressEntryApi(configuration);
}

export function useFileApi() {
  const configuration = useConfiguration();
  return new FileApi(configuration);
}

export function useApprovalRequestApi() {
  const configuration = useConfiguration();
  return new ApprovalRequestApi(configuration);
}
