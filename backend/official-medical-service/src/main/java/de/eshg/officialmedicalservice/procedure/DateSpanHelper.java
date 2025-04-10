/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateSpanHelper {

  public static class LocalDateSpan {
    private final LocalDate dateStart;
    private final LocalDate datePastEnd;

    public LocalDateSpan(LocalDate dateStart, LocalDate datePastEnd) {
      this.dateStart = dateStart;
      this.datePastEnd = datePastEnd;
    }

    public LocalDate getDateStart() {
      return dateStart;
    }

    public LocalDate getDateEnd() {
      return datePastEnd;
    }
  }

  public static final String DATE_SPAN_SEP = "<>";

  public static LocalDateSpan splitDateSpan(String dateSpan) {
    LocalDate dateStart = null;
    LocalDate dateEnd = null;
    if (dateSpan != null) {
      String[] split = dateSpan.split(DATE_SPAN_SEP, -1);
      dateStart = readDate(split[0]);
      dateEnd = readDate(split[1]);
    }
    return new LocalDateSpan(dateStart, dateEnd);
  }

  public static String joinDateSpan(LocalDate dateStart, LocalDate dateEnd) {
    return (dateStart == null ? "" : dateStart.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
        + DATE_SPAN_SEP
        + (dateEnd == null ? "" : dateEnd.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
  }

  private static LocalDate readDate(String date) {
    if (date == null || date.isEmpty()) {
      return null;
    }
    try {
      return LocalDate.parse(date);
    } catch (DateTimeException e) {
      return null;
    }
  }
}
