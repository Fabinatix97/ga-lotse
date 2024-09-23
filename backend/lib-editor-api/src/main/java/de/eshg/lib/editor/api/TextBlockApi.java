/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.editor.api.model.GetTextBlocksResponse;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockFilterParameters;
import de.eshg.lib.editor.api.model.TextBlockRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(value = BaseUrls.EditorLibrary.TEXTBLOCK_API)
@Tag(name = "TextBlock")
public interface TextBlockApi {
  String BASE_URL = BaseUrls.EditorLibrary.TEXTBLOCK_API;

  @PostExchange
  @Operation(summary = "Creates a new text block")
  @NotNull
  TextBlockDto createTextBlock(@Valid @RequestBody TextBlockRequest request);

  @GetExchange
  @Operation(summary = "Get all text blocks, filtered and paginated")
  @NotNull
  GetTextBlocksResponse getTextBlocks(
      @InlineParameterObject @ParameterObject @Valid TextBlockFilterParameters parameters);

  @GetExchange("/{textBlockId}")
  @Operation(summary = "Get a text block by its id")
  @NotNull
  TextBlockDto getTextBlock(@PathVariable("textBlockId") UUID id);

  @PatchExchange("/{textBlockId}")
  @Operation(summary = "Update the data for a text block")
  @NotNull
  TextBlockDto updateTextBlock(
      @PathVariable("textBlockId") UUID textBlockId, @Valid @RequestBody TextBlockRequest request);

  @DeleteExchange("/{textBlockId}")
  @Operation(summary = "Delete a text block")
  void deleteTextBlock(@PathVariable("textBlockId") UUID textBlockId);
}
