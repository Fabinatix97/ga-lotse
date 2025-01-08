/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.normalization;

import de.cronn.assertions.validationfile.normalization.IdNormalizer;
import de.cronn.assertions.validationfile.normalization.IncrementingIdProvider;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;

public class UuidNormalizer implements ValidationNormalizer {

  private final ValidationNormalizer delegate =
      new IdNormalizer(
          new IncrementingIdProvider(),
          "UUID_",
          "([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})");

  @Override
  public String normalize(String source) {
    return delegate.normalize(source);
  }
}
