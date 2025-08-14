/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.api.SchoolDto;
import de.eshg.schoolentry.domain.model.ProcedureLabel;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

public record ProcedureData(
    Long internalId,
    UUID externalId,
    long version,
    ProcedureType type,
    ChildData child,
    ProcedureStatus status,
    SchoolDto school,
    Year schoolYear,
    List<ProcedureLabel> labels,
    Instant appointmentStart,
    Instant createdAt,
    Instant modifiedAt) {
  public LocalDate getDateOfBirthOfChild() {
    return child().dateOfBirth();
  }
}
