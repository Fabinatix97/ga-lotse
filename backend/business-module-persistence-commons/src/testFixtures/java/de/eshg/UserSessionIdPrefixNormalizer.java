/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg;

import de.cronn.assertions.validationfile.normalization.IdNormalizer;
import de.cronn.assertions.validationfile.normalization.IncrementingIdProvider;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;

class UserSessionIdPrefixNormalizer implements ValidationNormalizer {

  private final ValidationNormalizer delegate =
      new IdNormalizer(
          new IncrementingIdProvider(),
          "USER_SESSION_",
          "(?<=userSessionId=)([0-9a-f]{8}-[0-9a-f]{4}…)");

  @Override
  public String normalize(String source) {
    return delegate.normalize(source);
  }
}
