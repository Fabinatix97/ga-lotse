/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenauth.api;

import de.eshg.travelmedicine.document.api.DocumentContentDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PatchInformationStatementRequest(
    @NotNull @Valid DocumentContentDto documentContentDto,
    @NotBlank @Size(max = 200) String signer) {}
