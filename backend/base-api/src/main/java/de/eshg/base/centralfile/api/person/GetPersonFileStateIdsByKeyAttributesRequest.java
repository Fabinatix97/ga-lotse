/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record GetPersonFileStateIdsByKeyAttributesRequest(
    @Valid @NotEmpty Set<PersonKeyAttributes> searchAttributes) {}
