/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "InspectionAvailablePLDRevisionsResponse")
public record InspectionAvailablePLDRevisionsResponse(
    @NotNull @Valid List<InspectionPLDRevisionDto> revisions) {}
