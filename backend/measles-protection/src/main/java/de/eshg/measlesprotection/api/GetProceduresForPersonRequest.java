/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record GetProceduresForPersonRequest(@NotNull @Valid AddPersonFileStateRequest person) {}
