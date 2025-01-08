/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGdprDownloadPackagesInfoResponse(
    @Valid @NotNull List<@NotNull GdprDownloadPackageInfoDto> downloadPackages) {}
