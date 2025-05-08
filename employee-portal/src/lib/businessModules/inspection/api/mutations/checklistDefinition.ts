/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AddChecklistDefinitionToCentralRepoRequest,
  ApiCLContext,
  ApiChecklistDefinitionFromCentralRepoUpdateRequest,
  ApiChecklistDefinitionVersion,
  ApiChecklistDefinitionVersionRequest,
  ApiCreateNewChecklistDefinitionRequest,
  DeleteChecklistDefinitionFromCentralRepoRequest,
  UpdateChecklistDefinitionToCentralRepoRequest,
} from "@eshg/inspection-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useChecklistDefinitionApi,
  useChecklistDefinitionCentralRepoApi,
} from "@/lib/businessModules/inspection/api/clients";

type FormCLContext = Omit<
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
  const snackbar = useSnackbar();
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
        published: cldVersion.context.published,
      };

      return await checklistDefinitionApi.createNewChecklistDefinition(
        createdChecklist,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Checkliste erfolgreich erstellt.");
    },
  });
}

export function useAddChecklistDefinitionVersion() {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({
      defId,
      cldVersion,
    }: {
      defId: string;
      cldVersion:
        | FormChecklistDefinitionVersion
        | ApiChecklistDefinitionVersion;
    }) => {
      const createdChecklist: ApiChecklistDefinitionVersionRequest = {
        description: cldVersion.context.description,
        name: cldVersion.context.name,
        sections: cldVersion.context.sections,
        isExpandable: cldVersion.context.expandable,
        deleted: cldVersion.context.deleted,
        published: cldVersion.context.published,
      };

      return await checklistDefinitionApi.addChecklistDefinitionVersion(
        defId,
        createdChecklist,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Checkliste erfolgreich aktualisiert");
    },
  });
}

export function useEditDraftChecklistDefinitionVersion() {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({
      versionId,
      cldVersion,
    }: {
      versionId: string;
      cldVersion:
        | FormChecklistDefinitionVersion
        | ApiChecklistDefinitionVersion;
    }) => {
      const request: ApiChecklistDefinitionVersionRequest = {
        description: cldVersion.context.description,
        name: cldVersion.context.name,
        sections: cldVersion.context.sections,
        isExpandable: cldVersion.context.expandable,
        deleted: cldVersion.context.deleted,
        published: cldVersion.context.published,
      };

      return await checklistDefinitionApi.editDraftChecklistDefinitionVersion(
        versionId,
        request,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Checkliste erfolgreich aktualisiert");
    },
  });
}

export function useDeleteDraftChecklistDefinitionVersion() {
  const checklistDefinitionApi = useChecklistDefinitionApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({ versionId }: { versionId: string }) => {
      return await checklistDefinitionApi.deleteDraftChecklistDefinitionVersion(
        versionId,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Entwurf erfolgreich gelöscht");
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
