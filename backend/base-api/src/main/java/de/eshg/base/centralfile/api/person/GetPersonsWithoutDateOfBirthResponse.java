/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetPersonsWithoutDateOfBirthResponse(
    @NotNull @Valid List<GetPersonWithoutDateOfBirthResponse> personsWithoutDateOfBirth) {}
