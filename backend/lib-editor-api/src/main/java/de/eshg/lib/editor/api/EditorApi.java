/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api;

import de.eshg.lib.editor.api.model.EditorDto;
import de.eshg.lib.editor.api.model.InsertEditorRequest;
import de.eshg.lib.editor.api.model.ModifyEditorElementResponse;
import de.eshg.lib.editor.api.model.UpdateEditorRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(BaseUrls.EditorLibrary.EDITOR_API)
@Tag(name = "Editor")
public interface EditorApi {

  @Operation(summary = "Get editor content")
  @GetExchange("/{editorId}")
  EditorDto loadEditor(@NotNull @PathVariable("editorId") UUID editorId);

  @Operation(summary = "Insert an editor element")
  @PostExchange("/{editorId}/element")
  ModifyEditorElementResponse insertEditorElement(
      @NotNull @PathVariable("editorId") UUID editorId,
      @Valid @RequestBody InsertEditorRequest request);

  @Operation(summary = "Update an editor element")
  @PatchExchange("/{editorId}/element/{elementId}")
  ModifyEditorElementResponse updateEditorElement(
      @NotNull @PathVariable("editorId") UUID editorId,
      @NotNull @PathVariable("elementId") UUID elementId,
      @Valid @RequestBody UpdateEditorRequest request);

  @Operation(summary = "Delete an editor element")
  @DeleteExchange("/{editorId}/element/{elementId}")
  void deleteEditorElement(
      @NotNull @PathVariable("editorId") UUID editorId,
      @NotNull @PathVariable("elementId") UUID elementId);
}
