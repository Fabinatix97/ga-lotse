/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "DetailedPerson")
public record DetailedPersonDto(
    @Valid @NotNull GetPersonFileStateResponse person, @NotNull PersonTypeDto personType) {}
