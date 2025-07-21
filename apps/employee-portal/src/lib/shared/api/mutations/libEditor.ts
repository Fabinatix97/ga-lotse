/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DeleteEditorElementRequest,
  EditorApiInterface,
  InsertEditorElementRequest,
  UpdateEditorElementRequest,
} from "@eshg/lib-editor-api";
import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

export function useInsertEditorElement(editorApi: EditorApiInterface) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: InsertEditorElementRequest) =>
      editorApi.insertEditorElementRaw(req).then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Element eingefügt."),
    // return null on error to indicate that the ui action should not continue
    onError: () => null,
  });
}

export function useUpdateEditorElement(editorApi: EditorApiInterface) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: UpdateEditorElementRequest) =>
      editorApi.updateEditorElementRaw(req).then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Element geändert."),
    // return null on error to indicate that the ui action should not continue
    onError: () => null,
  });
}

export function useDeleteEditorElement(editorApi: EditorApiInterface) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (req: DeleteEditorElementRequest) =>
      editorApi.deleteEditorElementRaw(req).then(unwrapRawResponse),
    onSuccess: () => snackbar.confirmation("Element gelöscht."),
    // return null on error to indicate that the ui action should not continue
    onError: () => null,
  });
}
