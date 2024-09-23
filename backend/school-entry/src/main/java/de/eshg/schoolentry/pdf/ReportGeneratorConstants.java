/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class ReportGeneratorConstants {
  private ReportGeneratorConstants() {}

  public static final Locale LOCALE = Locale.GERMANY;

  public static final DateTimeFormatter TIME_FORMAT_DE =
      DateTimeFormatter.ofPattern("HH:mm", LOCALE);

  public static final DateTimeFormatter DATE_FORMAT_DE =
      DateTimeFormatter.ofPattern("dd.MM.yyyy", LOCALE);

  public static final DateTimeFormatter FILENAME_TIMESTAMP_FORMAT =
      DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss", LOCALE);
}
