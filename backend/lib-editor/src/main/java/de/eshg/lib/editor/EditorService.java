/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor;

import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.ModifyEditorElementResponse;
import de.eshg.lib.editor.api.model.MoveOperation;
import de.eshg.lib.editor.api.model.element.EditorElementDto;
import java.util.UUID;

public interface EditorService {

  EditorDto loadEditor(UUID editorId);

  ModifyEditorElementResponse insertEditorElement(
      UUID editorId, EditorElementDto editorElementDto, Integer insertBefore, Integer insertAfter);

  ModifyEditorElementResponse updateEditorElement(
      UUID editorId,
      UUID elementId,
      UUID answerId,
      String title,
      String text,
      MoveOperation moveOperation);

  void deleteEditorElement(UUID editorId, UUID elementId);
}
