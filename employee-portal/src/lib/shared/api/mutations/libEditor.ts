/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DeleteEditorElementRequest,
  EditorApiInterface,
  InsertEditorElementRequest,
  UpdateEditorElementRequest,
} from "@eshg/employee-portal-api/libEditor";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

export function useInsertEditorElement(editorApi: EditorApiInterface) {
  return useHandledMutation({
    mutationFn: (req: InsertEditorElementRequest) =>
      editorApi.insertEditorElementRaw(req).then(unwrapRawResponse),
    // return null on error to indicate that the ui action should not continue
    onError: () => null,
  });
}

export function useUpdateEditorElement(editorApi: EditorApiInterface) {
  return useHandledMutation({
    mutationFn: (req: UpdateEditorElementRequest) =>
      editorApi.updateEditorElementRaw(req).then(unwrapRawResponse),
    // return null on error to indicate that the ui action should not continue
    onError: () => null,
  });
}

export function useDeleteEditorElement(editorApi: EditorApiInterface) {
  return useHandledMutation({
    mutationFn: (req: DeleteEditorElementRequest) =>
      editorApi.deleteEditorElementRaw(req).then(unwrapRawResponse),
    // return null on error to indicate that the ui action should not continue
    onError: () => null,
  });
}
