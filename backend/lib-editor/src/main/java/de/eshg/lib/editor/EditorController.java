/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor;

import de.eshg.lib.editor.api.EditorApi;
import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.InsertEditorRequest;
import de.eshg.lib.editor.api.model.ModifyEditorElementResponse;
import de.eshg.lib.editor.api.model.UpdateEditorRequest;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EditorController implements EditorApi {

  private final EditorService editorService;

  public EditorController(EditorService editorService) {
    this.editorService = editorService;
  }

  @Override
  @Transactional(readOnly = true)
  public EditorDto loadEditor(UUID editorId) {
    return editorService.loadEditor(editorId);
  }

  @Override
  @Transactional
  public ModifyEditorElementResponse insertEditorElement(
      UUID editorId, InsertEditorRequest request) {
    return editorService.insertEditorElement(
        editorId, request.editorElement(), request.insertBefore(), request.insertAfter());
  }

  @Override
  @Transactional
  public ModifyEditorElementResponse updateEditorElement(
      UUID editorId, UUID elementId, UpdateEditorRequest request) {
    return editorService.updateEditorElement(
        editorId,
        elementId,
        request.answerId(),
        request.title(),
        request.text(),
        request.moveOperation());
  }

  @Override
  @Transactional
  public void deleteEditorElement(UUID editorId, UUID elementId) {
    editorService.deleteEditorElement(editorId, elementId);
  }
}
