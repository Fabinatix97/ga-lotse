/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal";
import {
  ApiCreateTextTemplateRequest,
  ApiCreateTextTemplateResponse,
  ApiTextTemplate,
} from "@eshg/sti-protection-api";

import { useTextTemplateApi } from "@/lib/businessModules/stiProtection/api/clients";

import { MutationPassThrough } from "./types";

export function useCreateTextTemplate({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateTextTemplateResponse,
  ApiCreateTextTemplateRequest
> = {}) {
  const appointmentTypeApi = useTextTemplateApi();
  return useHandledMutation({
    mutationFn: (template: ApiCreateTextTemplateRequest) =>
      appointmentTypeApi.createTextTemplate(template),
    onSuccess,
    onError,
  });
}

export function useUpdateTextTemplate({
  onSuccess,
  onError,
}: MutationPassThrough<void, ApiTextTemplate> = {}) {
  const appointmentTypeApi = useTextTemplateApi();
  return useHandledMutation({
    mutationFn: (template: ApiTextTemplate) =>
      appointmentTypeApi.updateTextTemplate(template.externalId, template),
    onSuccess,
    onError,
  });
}

export function useDeleteTextTemplate({
  onSuccess,
  onError,
}: MutationPassThrough<void, string> = {}) {
  const appointmentTypeApi = useTextTemplateApi();
  return useHandledMutation({
    mutationFn: (id: string) => appointmentTypeApi.deleteTextTemplate(id),
    onSuccess,
    onError,
  });
}
