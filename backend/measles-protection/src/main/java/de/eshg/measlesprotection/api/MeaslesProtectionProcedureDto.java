/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = MeaslesProtectionProcedureDto.SCHEMA_NAME)
public record MeaslesProtectionProcedureDto(
    @NotNull UUID id,
    @NotNull Instant createdAt,
    @NotNull @Valid AffectedPersonDto affectedPerson,
    @Valid List<CustodianDto> custodians,
    @NotNull @Valid FacilityDto facility,
    @NotNull @Valid ReportDataDto reportData,
    @Valid List<ProofSubmissionDto> proofSubmissions,
    @Valid List<MonetaryFineDto> monetaryFines,
    @Valid AccessRestrictionDto accessRestriction,
    @NotNull ProcedureStatusDto procedureStatus,
    @NotNull boolean isOpen,
    @NotNull CaseStatusDto caseStatus,
    @Valid AppointmentDto appointment)
    implements ProtectionProcedureDto {

  public static final String SCHEMA_NAME = "MeaslesProtectionProcedure";
}
