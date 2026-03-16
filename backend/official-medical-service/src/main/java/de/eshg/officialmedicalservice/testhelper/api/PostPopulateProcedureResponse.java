/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
    @NotNull @Valid Map<String, UUID> assessments,
    @Valid CitizenPortalCredentialsDto credentials) {}
