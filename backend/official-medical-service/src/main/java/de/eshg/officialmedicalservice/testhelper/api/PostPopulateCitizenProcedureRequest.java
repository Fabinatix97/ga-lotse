/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PostPopulateCitizenProcedureRequest(
    @NotNull ConcernTestDataConfig concern,
    @NotNull @Valid AppointmentPopulationDto appointment,
    @NotNull @Valid AffectedPersonDto affectedPerson,
    @NotNull List<FileTestDataConfig> files) {}
