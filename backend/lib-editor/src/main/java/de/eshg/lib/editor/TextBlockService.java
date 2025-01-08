/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor;

import de.eshg.lib.editor.api.model.GetTextBlocksResponse;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockFilterParameters;
import de.eshg.lib.editor.api.model.TextBlockRequest;
import java.util.UUID;

public interface TextBlockService {
  TextBlockDto createTextBlock(TextBlockRequest request);

  GetTextBlocksResponse getTextBlocks(TextBlockFilterParameters parameters);

  TextBlockDto loadTextBlock(UUID textBlockId);

  TextBlockDto updateTextBlock(UUID textBlockId, TextBlockRequest request);

  void deleteTextBlock(UUID textBlockId);
}
