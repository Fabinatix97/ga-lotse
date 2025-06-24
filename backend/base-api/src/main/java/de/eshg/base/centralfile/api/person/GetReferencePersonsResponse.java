/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

public record GetReferencePersonsResponse(
    @NotNull @Valid Map<UUID, GetReferencePersonResponse> personsWithReferencingFileStateId) {}
