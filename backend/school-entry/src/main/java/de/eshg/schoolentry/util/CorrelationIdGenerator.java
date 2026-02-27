/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import java.util.function.Supplier;
import org.apache.commons.text.RandomStringGenerator;
import org.apache.commons.text.TextRandomProvider;

public class CorrelationIdGenerator {

  private static final int CORRELATION_ID_LENGTH = 6;

  private final Supplier<TextRandomProvider> randomProviderSupplier;
  private RandomStringGenerator generator;

  public CorrelationIdGenerator(Supplier<TextRandomProvider> randomProviderSupplier) {
    this.randomProviderSupplier = randomProviderSupplier;
    generator = buildGenerator();
  }

  /**
   * Recreate the generator with a new TextRandomProvider from the given supplier. This must not
   * have any effect on generated values when using a *real* random provider, but can be used to
   * reset the "randomness" for tests (i.e. when using a random provider with a seed)
   */
  public void reset() {
    generator = buildGenerator();
  }

  private RandomStringGenerator buildGenerator() {
    return RandomStringGenerator.builder()
        .usingRandom(randomProviderSupplier.get())
        .withinRange(new char[] {'0', '9'}, new char[] {'A', 'Z'}, new char[] {'a', 'z'})
        .get();
  }

  public String generateCorrelationId() {
    return generator.generate(CORRELATION_ID_LENGTH);
  }
}
