/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PatchAffectedPersonRequest")
public record PatchAffectedPersonRequest(
    @NotNull @Valid AffectedPersonDetailsDto affectedPersonDetails) {}
