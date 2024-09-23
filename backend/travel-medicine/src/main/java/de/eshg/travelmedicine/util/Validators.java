/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.util;

import de.eshg.rest.service.error.BadRequestException;
import java.util.regex.Pattern;

public class Validators {

  private Validators() {}

  public static String validateBatchId(String batchId) {
    if (batchId == null || batchId.isBlank()) {
      return null;
    }

    batchId = batchId.replaceAll("\\s{2,}", " ").trim();
    Pattern validPattern = Pattern.compile("^[a-zA-Z0-9\\-_#*~\\s]*$");

    if (batchId.length() > 200) {
      throw new BadRequestException("batch id cannot contain more than 200 characters");
    }
    if (batchId.length() < 3) {
      throw new BadRequestException("batch id must contain at least 3 characters");
    }
    if (!validPattern.matcher(batchId).matches()) {
      throw new BadRequestException(
          "batch id contains invalid characters. characters allowed: -_#*~");
    }

    return batchId;
  }
}
