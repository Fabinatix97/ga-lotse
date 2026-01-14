/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.normalization;

import de.cronn.assertions.validationfile.normalization.IdNormalizer;
import de.cronn.assertions.validationfile.normalization.IncrementingIdProvider;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;

public class HumanReadablePersonIdNormalizer implements ValidationNormalizer {

  private final ValidationNormalizer delegate =
      new IdNormalizer(
          new IncrementingIdProvider(),
          "PersonId_",
          "\"humanReadableId\" : \"([2-9A-HJ-NP-Z]{8})\"");

  @Override
  public String normalize(String source) {
    return delegate.normalize(source);
  }
}
