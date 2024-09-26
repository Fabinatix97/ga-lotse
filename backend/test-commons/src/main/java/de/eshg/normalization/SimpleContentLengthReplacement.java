/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.normalization;

import de.cronn.assertions.validationfile.normalization.SimpleRegexReplacement;

public class SimpleContentLengthReplacement extends SimpleRegexReplacement {

  public SimpleContentLengthReplacement() {
    super("Content-Length: \\[\\d*\\]", "Content-Length: [LENGTH]");
  }
}
