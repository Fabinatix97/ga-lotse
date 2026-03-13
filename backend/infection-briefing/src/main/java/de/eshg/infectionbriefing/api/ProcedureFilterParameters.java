/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import java.time.LocalDate;
import java.time.Year;
import java.util.LinkedHashSet;

public record ProcedureFilterParameters(
    LocalDate appointmentDay,
    InstructionTypeDto instructionType,
    Year instructionYear,
    LinkedHashSet<ProcedureStatusDto> status) {}
