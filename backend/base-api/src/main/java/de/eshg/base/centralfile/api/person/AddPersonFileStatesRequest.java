/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record AddPersonFileStatesRequest(
    @NotNull @Valid @Size(min = 1, max = 10000) List<@NotNull AddPersonFileStateRequest> persons) {}
