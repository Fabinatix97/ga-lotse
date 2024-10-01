/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetPersonFileStateIdsByKeyAttributesResponse(
    @Valid @NotNull Map<PersonKeyAttributes, List<UUID>> fileStateIdsByPersons) {}
