/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(
    name = DraftMeaslesProcedureDto.SCHEMA_NAME,
    description =
        "Used for the initial creation and completion of the procedure, and also for validation of externally submitted procedures.")
public record DraftMeaslesProcedureDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    @NotNull @Valid AffectedPersonDto affectedPerson,
    @Valid List<CustodianDto> custodians,
    @Valid FacilityDto facility,
    @Valid ReportDataDto reportData,
    @NotNull ProcedureStatusDto procedureStatus,
    @NotNull boolean isOpen,
    @Valid MeaslesVaccinationStatusDto measlesVaccinationStatusFromSchoolEntry,
    CaseStatusDto caseStatus)
    implements ProtectionProcedureDto {
  public static final String SCHEMA_NAME = "DraftMeaslesProcedure";
}
