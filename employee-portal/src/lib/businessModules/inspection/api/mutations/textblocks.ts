/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiTextBlockRequest,
  UpdateTextBlockRequest,
} from "@eshg/employee-portal-api/inspection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useTextBlockApi } from "@/lib/businessModules/inspection/api/clients";

export function useCreateTextBlock() {
  const textBlockApi = useTextBlockApi();

  return useHandledMutation({
    mutationFn: async (request: ApiTextBlockRequest) => {
      return await textBlockApi.createTextBlock(request);
    },
  });
}

export function useUpdateTextBlock() {
  const textBlockApi = useTextBlockApi();

  return useHandledMutation({
    mutationFn: async (request: UpdateTextBlockRequest) => {
      await textBlockApi.updateTextBlockRaw(request);
    },
  });
}

export function useDeleteTextBlock() {
  const textBlockApi = useTextBlockApi();

  return useHandledMutation({
    mutationFn: async (id: string) => textBlockApi.deleteTextBlock(id),
  });
}
