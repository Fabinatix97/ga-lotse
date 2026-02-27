/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ProcedureDetails")
public record ProcedureDetailsDto(
    @NotNull UUID procedureId,
    @NotNull ProcedureStatusDto procedureStatus,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull @Valid PersonDetailsDto applicant,
    @NotNull CustodianConsentInfoDto custodianConsent,
    Instant appointmentTime,
    ApplicantCategoryDto applicantCategory,
    LocalDate instructionDate,
    InstructionTypeDto instructionType,
    ProcedureSourceDto sourceDto) {}
