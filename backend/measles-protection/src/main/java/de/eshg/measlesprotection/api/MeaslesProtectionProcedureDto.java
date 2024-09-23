/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.util.CollectionUtils;

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

  @AssertTrue(message = "An underage patient needs at least one custodian.")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isAdultOrHasCustodian() {
    return affectedPerson.isAdult() || !CollectionUtils.isEmpty(custodians);
  }
}
