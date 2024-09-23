/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor;

import de.eshg.lib.editor.api.TextBlockApi;
import de.eshg.lib.editor.api.model.GetTextBlocksResponse;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockFilterParameters;
import de.eshg.lib.editor.api.model.TextBlockRequest;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TextBlockController implements TextBlockApi {

  private final TextBlockService textBlockService;

  public TextBlockController(TextBlockService textBlockService) {
    this.textBlockService = textBlockService;
  }

  @Override
  @Transactional
  @NotNull
  public TextBlockDto createTextBlock(TextBlockRequest request) {
    return textBlockService.createTextBlock(request);
  }

  @Override
  @Transactional(readOnly = true)
  @NotNull
  public GetTextBlocksResponse getTextBlocks(TextBlockFilterParameters parameters) {
    return textBlockService.getTextBlocks(parameters);
  }

  @Override
  @Transactional(readOnly = true)
  @NotNull
  public TextBlockDto getTextBlock(UUID id) {
    return textBlockService.loadTextBlock(id);
  }

  @Override
  @Transactional
  @NotNull
  public TextBlockDto updateTextBlock(UUID textBlockId, TextBlockRequest request) {
    return textBlockService.updateTextBlock(textBlockId, request);
  }

  @Override
  @Transactional
  public void deleteTextBlock(UUID textBlockId) {
    textBlockService.deleteTextBlock(textBlockId);
  }
}
