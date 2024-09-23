/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateProcedureResponse(@NotNull UUID procedureId) {}
