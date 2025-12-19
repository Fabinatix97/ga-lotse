/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import de.eshg.rest.service.error.BadRequestException;
import java.util.List;
import java.util.Objects;

public class CsvValidator {

  private CsvValidator() {}

  private static final List<ForbiddenSequence> forbiddenSequence =
      List.of(
          new ForbiddenSequence("\t", "CSV contains forbidden character: tabulator"),
          new ForbiddenSequence("\r", "CSV contains forbidden character: carriage return"),
          new ForbiddenSequence(",="),
          new ForbiddenSequence(";="),
          new ForbiddenSequence(",+"),
          new ForbiddenSequence(";+"),
          new ForbiddenSequence(",-"),
          new ForbiddenSequence(";-"),
          new ForbiddenSequence(",@"),
          new ForbiddenSequence(";@"));

  public static void validate(byte[] fileContent) {
    String withoutCrlf = new String(fileContent).replace("\r\n", "\n");

    for (ForbiddenSequence forbiddenSequence : forbiddenSequence) {
      if (withoutCrlf.contains(forbiddenSequence.sequence)) {
        throw new BadRequestException(forbiddenSequence.getEffectiveErrorMessage());
      }
    }
  }

  private record ForbiddenSequence(String sequence, String customErrorMessage) {
    ForbiddenSequence(String sequence) {
      this(sequence, null);
    }

    private String getEffectiveErrorMessage() {
      return Objects.requireNonNullElseGet(
          customErrorMessage,
          () -> "CSV contains forbidden character sequence: %s".formatted(sequence));
    }
  }
}
