/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApprovalRequestApi,
  ArchivingApi,
  ChecklistApi,
  ChecklistDefinitionApi,
  ChecklistDefinitionCentralRepoApi,
  Configuration,
  EditorApi,
  FacilityApi,
  FileApi,
  ImporterApi,
  InboxProcedureApi,
  InspectionApi,
  InspectionFeatureTogglesApi,
  InspectionGeoApi,
  InspectionIncidentApi,
  InspectionTestDataApi,
  ObjectTypeApi,
  PacklistApi,
  PacklistDefinitionApi,
  ProcedureApi,
  ProgressEntryApi,
  TaskApi,
  TextBlockApi,
  WebSearchApi,
} from "@eshg/employee-portal-api/inspection";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

export function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_INSPECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useInspectionApi() {
  const configuration = useConfiguration();
  return new InspectionApi(configuration);
}

export function useInspectionTestDataApi() {
  const configuration = useConfiguration();
  return new InspectionTestDataApi(configuration);
}

export function useEditorApi() {
  const configuration = useConfiguration();
  return new EditorApi(configuration);
}

export function useChecklistApi() {
  const configuration = useConfiguration();
  return new ChecklistApi(configuration);
}

export function useChecklistDefinitionApi() {
  const configuration = useConfiguration();
  return new ChecklistDefinitionApi(configuration);
}

export function useChecklistDefinitionCentralRepoApi() {
  const configuration = useConfiguration();
  return new ChecklistDefinitionCentralRepoApi(configuration);
}

export function useInboxProcedureApi() {
  const configuration = useConfiguration();
  return new InboxProcedureApi(configuration);
}

export function useTextBlockApi() {
  const configuration = useConfiguration();
  return new TextBlockApi(configuration);
}

export function useFacilityApi() {
  const configuration = useConfiguration();
  return new FacilityApi(configuration);
}

export function useObjectTypeApi() {
  const configuration = useConfiguration();
  return new ObjectTypeApi(configuration);
}

export function useIncidentApi() {
  const configuration = useConfiguration();
  return new InspectionIncidentApi(configuration);
}

export function useProgressEntryApi() {
  const configuration = useConfiguration();
  return new ProgressEntryApi(configuration);
}

export function useProcedureApi() {
  const configuration = useConfiguration();
  return new ProcedureApi(configuration);
}

export function useTaskApi() {
  const configuration = useConfiguration();
  return new TaskApi(configuration);
}

export function useFileApi() {
  const configuration = useConfiguration();
  return new FileApi(configuration);
}

export function useApprovalRequestApi() {
  const configuration = useConfiguration();
  return new ApprovalRequestApi(configuration);
}

export function useWebSearchApi() {
  const configuration = useConfiguration();
  return new WebSearchApi(configuration);
}

export function useInspectionGeoApi() {
  const configuration = useConfiguration();
  return new InspectionGeoApi(configuration);
}

export function usePacklistApi() {
  const configuration = useConfiguration();
  return new PacklistApi(configuration);
}

export function usePacklistDefinitionApi() {
  const configuration = useConfiguration();
  return new PacklistDefinitionApi(configuration);
}

export function useInspectionFeatureTogglesApi() {
  const configuration = useConfiguration();
  return new InspectionFeatureTogglesApi(configuration);
}

export function useArchivingApi() {
  const configuration = useConfiguration();
  return new ArchivingApi(configuration);
}

export function useImportApi() {
  const configuration = useConfiguration();
  return new ImporterApi(configuration);
}
