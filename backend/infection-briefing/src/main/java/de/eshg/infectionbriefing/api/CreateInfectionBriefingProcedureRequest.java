/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.infectionbriefing.domain.model.InstructionType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;

public record CreateInfectionBriefingProcedureRequest(
    @Valid PersonWithEmailDto applicant,
    @Valid ApplicantAddressDto applicantAddress,
    @NotNull Instant appointmentStartTime,
    LocalDate instructionDate,
    @NotNull ProcedureStatus procedureStatus,
    @NotNull ProcedureType procedureType,
    @NotNull InstructionType instructionType) {}
