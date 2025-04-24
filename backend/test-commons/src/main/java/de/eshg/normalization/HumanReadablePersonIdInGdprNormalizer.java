/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.normalization;

import de.cronn.assertions.validationfile.normalization.IdNormalizer;
import de.cronn.assertions.validationfile.normalization.IncrementingIdProvider;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;

public class HumanReadablePersonIdInGdprNormalizer implements ValidationNormalizer {
  // To avoid collateral damage, we assume that the number has at least 8 digits, which will be true
  // for 99.99% of randomly generated IDs
  private final ValidationNormalizer delegate =
      new IdNormalizer(
          new IncrementingIdProvider(), "PersonId_", "\\.humanReadableId\\,([1-9]\\d{7,12})");

  @Override
  public String normalize(String source) {
    return delegate.normalize(source);
  }
}
