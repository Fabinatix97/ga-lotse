/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.draft;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record AddCustodianRequest(@NotNull @Valid CustodianDetailsDto custodian) {}
