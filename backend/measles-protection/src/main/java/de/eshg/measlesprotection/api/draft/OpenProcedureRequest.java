/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.draft;

import de.eshg.measlesprotection.api.ReportDataDto;
import de.eshg.measlesprotection.api.RoleStatusDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record OpenProcedureRequest(
    @NotNull @Valid ReportDataDto reportData, @NotNull RoleStatusDto roleStatus) {}
