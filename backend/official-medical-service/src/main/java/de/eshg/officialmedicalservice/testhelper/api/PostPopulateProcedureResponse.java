/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PostPopulateProcedureResponse(@NotNull UUID procedureId) {}
