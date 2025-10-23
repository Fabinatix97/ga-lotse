/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record AddCustodianRequest(
    @NotNull @Valid CreatePersonDto custodian, @NotNull Long procedureVersion) {}
