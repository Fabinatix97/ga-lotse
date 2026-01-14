/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.measlesprotection.api.draft.CustodianDetailsDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PatchCustodianRequest")
public record PatchCustodianRequest(@NotNull @Valid CustodianDetailsDto custodianDetails) {}
