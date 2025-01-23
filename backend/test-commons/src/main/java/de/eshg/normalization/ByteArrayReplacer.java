/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.normalization;

import de.cronn.assertions.validationfile.replacements.Replacer;

public class ByteArrayReplacer extends Replacer {
  private static final String BYTE_ARRAY_TO_STRING_PATTERN = "\\[B@[a-f0-9]+";

  public ByteArrayReplacer() {
    super(BYTE_ARRAY_TO_STRING_PATTERN, "[MASKED-BYTE-ARRAY]");
  }

  public ByteArrayReplacer(String replacement) {
    super(BYTE_ARRAY_TO_STRING_PATTERN, replacement);
  }
}
