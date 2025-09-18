/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProcedureFilterParameters(
    ProcedureTypeDto procedureTypeFilter,
    UUID schoolIdFilter,
    @Min(1900) Integer schoolYearFilter,
    LocalDate dayOfAppointmentFilter,
    Boolean hasAppointmentFilter,
    List<UUID> labelsFilter,
    List<UUID> excludedLabelsFilter,
    Boolean isInvitationSentFilter,
    Boolean hasExaminationEditsFilter) {}
