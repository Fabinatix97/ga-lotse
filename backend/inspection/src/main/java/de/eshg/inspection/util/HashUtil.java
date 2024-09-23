/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import de.eshg.inspection.common.persistence.HashAlgorithm;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.util.HexFormat;
import org.bouncycastle.jcajce.provider.digest.Blake2b;

public final class HashUtil {

  private static final int BUFFER_SIZE = 8192;

  private HashUtil() {}

  public static String hash(InputStream inputStream, HashAlgorithm algorithm) throws IOException {
    return switch (algorithm) {
      case BLAKE2B_512 -> hash(inputStream, new Blake2b.Blake2b512());
    };
  }

  public static String hash(String valueToHash, HashAlgorithm algorithm) {
    return switch (algorithm) {
      case BLAKE2B_512 -> hash(valueToHash, new Blake2b.Blake2b512());
    };
  }

  private static String hash(InputStream inputStream, MessageDigest messageDigest)
      throws IOException {

    try (DigestInputStream digestInputStream = new DigestInputStream(inputStream, messageDigest)) {
      byte[] buffer = new byte[BUFFER_SIZE];
      while (digestInputStream.read(buffer) > -1)
        ;
      return HexFormat.of().formatHex(messageDigest.digest());
    }
  }

  private static String hash(String valueToHash, MessageDigest messageDigest) {
    byte[] hashedChecklist = messageDigest.digest(valueToHash.getBytes(StandardCharsets.UTF_8));
    return HexFormat.of().formatHex(hashedChecklist);
  }

  public static boolean verify(InputStream inputStream, String hashValue, HashAlgorithm algorithm)
      throws IOException {
    return hashValue.equals(hash(inputStream, algorithm));
  }

  public static boolean verify(String valueToHash, String hashValue, HashAlgorithm algorithm) {
    return hashValue.equals(hash(valueToHash, algorithm));
  }
}
