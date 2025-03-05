/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

public record PostPopulateProcedureResponse(
    @NotNull UUID procedureId,
    UUID facilityId,
    @NotNull @Valid Map<String, UUID> appointments,
    @Valid Map<String, UUID> documentMap,
    @Valid CitizenPortalCredentialsDto credentials) {}
