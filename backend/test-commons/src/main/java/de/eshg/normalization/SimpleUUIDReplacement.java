/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.normalization;

import de.cronn.assertions.validationfile.normalization.SimpleRegexReplacement;

public class SimpleUUIDReplacement extends SimpleRegexReplacement {

  public SimpleUUIDReplacement() {
    super("([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})", "UUID");
  }
}
