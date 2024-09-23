/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddPacklistDefinitionRevisionRequest,
  ApiCreateNewPacklistDefinitionRequest,
  ApiPacklistDefinitionElement,
} from "@eshg/employee-portal-api/inspection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { usePacklistDefinitionApi } from "@/lib/businessModules/inspection/api/clients";

export interface FormPacklistDefinitionRevision {
  name: string;
  description?: string;
  elements: ApiPacklistDefinitionElement[];
  objectTypeId?: string;
}

export function useCreatePacklistDefinition() {
  const packlistDefinitionApi = usePacklistDefinitionApi();
  return useHandledMutation({
    mutationFn: async (pldRevision: FormPacklistDefinitionRevision) => {
      const createdPacklist: ApiCreateNewPacklistDefinitionRequest = {
        description: pldRevision.description,
        name: pldRevision.name,
        elements: pldRevision.elements.map((element) => element.text),
        objectTypeId: pldRevision.objectTypeId ?? "",
      };

      return await packlistDefinitionApi.createNewPacklistDefinition(
        createdPacklist,
      );
    },
  });
}

export function useUpdatePacklistDefinition() {
  const packlistDefinitionApi = usePacklistDefinitionApi();
  return useHandledMutation({
    mutationFn: async ({
      defId,
      version,
      pldRevision,
    }: {
      defId: string;
      version: number;
      pldRevision: FormPacklistDefinitionRevision;
    }) => {
      const createdPacklist: ApiAddPacklistDefinitionRevisionRequest = {
        description: pldRevision.description,
        name: pldRevision.name,
        elements: pldRevision.elements.map((element) => element.text),
        version: version,
      };

      return await packlistDefinitionApi.addPacklistDefinitionRevision(
        defId,
        createdPacklist,
      );
    },
  });
}
