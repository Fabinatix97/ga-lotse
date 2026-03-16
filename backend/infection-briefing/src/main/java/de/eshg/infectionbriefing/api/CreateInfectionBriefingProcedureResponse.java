/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateInfectionBriefingProcedureResponse(@NotNull UUID procedureId) {}
