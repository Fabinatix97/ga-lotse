/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

public record PostPopulateProcedureResponse(
    @NotNull UUID procedureId,
    @Valid @NotNull Map<String, UUID> procedureStepsCreated,
    @Valid @NotNull Map<String, UUID> servicesCreated,
    @Valid @NotNull Map<String, UUID> informationStatementsCreated,
    @Valid CitizenPortalCredentialsDto credentials) {}
