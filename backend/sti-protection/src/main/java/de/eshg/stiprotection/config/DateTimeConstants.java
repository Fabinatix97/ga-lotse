/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class DateTimeConstants {
  private DateTimeConstants() {}

  public static final DateTimeFormatter DATE_FORMAT_DE =
      DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMANY);

  public static final DateTimeFormatter TIME_FORMAT_DE = DateTimeFormatter.ofPattern("HH:mm");
}
