/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AddChecklistDefinitionToCentralRepoRequest,
  ApiAddChecklistDefinitionVersionRequest,
  ApiCLContext,
  ApiChecklistDefinitionFromCentralRepoUpdateRequest,
  ApiCreateNewChecklistDefinitionRequest,
  DeleteChecklistDefinitionFromCentralRepoRequest,
  UpdateChecklistDefinitionToCentralRepoRequest,
} from "@eshg/employee-portal-api/inspection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useChecklistDefinitionApi,
  useChecklistDefinitionCentralRepoApi,
} from "@/lib/businessModules/inspection/api/clients";

export type FormCLContext = Omit<
  ApiCLContext,
  "id" | "defId" | "validFrom" | "validTo" | "version"
>;

export interface FormChecklistDefinitionVersion {
  context: FormCLContext;
  objectTypeId?: string;
  isCoreChecklist?: boolean;
}

export function useCreateChecklistDefinition() {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  return useHandledMutation({
    mutationFn: async (cldVersion: FormChecklistDefinitionVersion) => {
      const createdChecklist: ApiCreateNewChecklistDefinitionRequest = {
        description: cldVersion.context.description,
        name: cldVersion.context.name,
        sections: cldVersion.context.sections,
        objectTypeId: cldVersion.objectTypeId ?? "",
        isCoreChecklist: cldVersion.isCoreChecklist,
        isExpandable: cldVersion.context.expandable,
        deleted: cldVersion.context.deleted,
      };

      return await checklistDefinitionApi.createNewChecklistDefinition(
        createdChecklist,
      );
    },
  });
}

export function useUpdateChecklistDefinition() {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  return useHandledMutation({
    mutationFn: async ({
      defId,
      cldVersion,
    }: {
      defId: string;
      cldVersion: FormChecklistDefinitionVersion;
    }) => {
      const createdChecklist: ApiAddChecklistDefinitionVersionRequest = {
        description: cldVersion.context.description,
        name: cldVersion.context.name,
        sections: cldVersion.context.sections,
        isExpandable: cldVersion.context.expandable,
        deleted: cldVersion.context.deleted,
      };

      return await checklistDefinitionApi.addChecklistDefinitionVersion(
        defId,
        createdChecklist,
      );
    },
  });
}

export function useAddChecklistDefinitionToCentralRepo() {
  const repoApi = useChecklistDefinitionCentralRepoApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: AddChecklistDefinitionToCentralRepoRequest) =>
      repoApi
        .addChecklistDefinitionToCentralRepoRaw(req)
        .then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Checkliste erfolgreich bereitgestellt"),
  });
}

export function useUpdateChecklistDefinitionToCentralRepo() {
  const repoApi = useChecklistDefinitionCentralRepoApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: UpdateChecklistDefinitionToCentralRepoRequest) =>
      repoApi
        .updateChecklistDefinitionToCentralRepoRaw(req)
        .then(unwrapRawResponse),
    onSuccess: () =>
      snackbar.confirmation("Checkliste erfolgreich aktualisiert"),
  });
}

export function useSyncCentralRepoChecklistDefinition() {
  const repoApi = useChecklistDefinitionCentralRepoApi();
  return useHandledMutation({
    mutationFn: (req: ApiChecklistDefinitionFromCentralRepoUpdateRequest) =>
      repoApi.updateChecklistDefinitionsFromCentralRepo(req),
  });
}

export function useDeleteCentralRepoChecklistDefinition() {
  const repoApi = useChecklistDefinitionCentralRepoApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: DeleteChecklistDefinitionFromCentralRepoRequest) =>
      repoApi
        .deleteChecklistDefinitionFromCentralRepoRaw(req)
        .then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Checkliste erfolgreich gelöscht"),
  });
}
