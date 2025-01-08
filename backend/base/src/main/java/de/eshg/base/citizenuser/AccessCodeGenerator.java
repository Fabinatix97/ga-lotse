/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser;

import de.cronn.commons.lang.StreamUtil;
import java.util.List;
import java.util.Set;
import java.util.function.Supplier;
import org.apache.commons.text.RandomStringGenerator;
import org.apache.commons.text.TextRandomProvider;

public class AccessCodeGenerator {
  private static final List<Character> AMBIGUOUS_CHARS = List.of('0', 'O', 'I', '1', 'l');

  private static final int ENTROPY_BITS = 96;
  private static final int ALPHABET_LENGTH = 26 * 2 + 10 - AMBIGUOUS_CHARS.size();
  private static final int ACCESS_CODE_LENGTH =
      (int) Math.ceil(ENTROPY_BITS * Math.log(2) / Math.log(ALPHABET_LENGTH));

  private static final Set<Integer> EXCLUDED_CODE_POINTS =
      AMBIGUOUS_CHARS.stream()
          .map(Object::toString)
          .map(charAsString -> charAsString.codePointAt(0))
          .collect(StreamUtil.toLinkedHashSet());

  private final Supplier<TextRandomProvider> randomProviderSupplier;
  private RandomStringGenerator generator;

  public AccessCodeGenerator(Supplier<TextRandomProvider> randomProviderSupplier) {
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
        .withinRange(new char[] {'a', 'z'}, new char[] {'A', 'Z'}, new char[] {'0', '9'})
        .filteredBy(character -> !EXCLUDED_CODE_POINTS.contains(character))
        .build();
  }

  public String generateAccessCode() {
    return generator.generate(ACCESS_CODE_LENGTH);
  }
}
