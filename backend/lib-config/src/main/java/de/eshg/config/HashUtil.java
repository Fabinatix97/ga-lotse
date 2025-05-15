/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import org.apache.commons.lang3.exception.UncheckedException;

public class HashUtil {

  private HashUtil() {}

  public static String hashOf(byte[] content) {
    try {
      return "[hash: "
          + HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content))
          + "]";
    } catch (NoSuchAlgorithmException e) {
      throw new UncheckedException(e);
    }
  }
}
