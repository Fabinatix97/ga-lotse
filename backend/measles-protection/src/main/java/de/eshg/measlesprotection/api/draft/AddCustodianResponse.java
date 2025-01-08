/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.draft;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddCustodianResponse(
    @NotNull UUID id, @NotNull @Valid CustodianDetailsDto custodian) {}
