/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

import de.eshg.measlesprotection.config.DateTimeConstants;
import java.time.LocalDate;

public record CoverLetterBody(
    LocalDate deadline,
    LocalDate date,
    LocalDate previousLetterDate,
    String yourReference,
    String ourReference) {

  public CoverLetterBody(LocalDate deadline, LocalDate date, LocalDate previousLetterDate) {
    this(deadline, date, previousLetterDate, null, null);
  }

  @SuppressWarnings("unused") // used in Apache FreeMarker templates
  public String deadlineString() {
    return deadline.format(DateTimeConstants.DATE_FORMAT_DE);
  }

  @SuppressWarnings("unused") // used in Apache FreeMarker templates
  public String dateString() {
    return date.format(DateTimeConstants.DATE_FORMAT_DE);
  }

  @SuppressWarnings("unused") // used in Apache FreeMarker templates
  public String previousLetterDateString() {
    return previousLetterDate.format(DateTimeConstants.DATE_FORMAT_DE);
  }
}
