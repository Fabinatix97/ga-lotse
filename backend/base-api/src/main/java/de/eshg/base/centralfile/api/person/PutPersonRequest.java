/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(
    description =
        "Request used for performing a consistent update of file state and associated reference person")
public record PutPersonRequest(@NotNull @Valid PersonDetailsDto updatedPerson) {}
