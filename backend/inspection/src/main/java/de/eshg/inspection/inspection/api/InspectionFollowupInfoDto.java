/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InspectionFollowupInfo")
public record InspectionFollowupInfoDto(
    FollowupType followupType, Instant followupDate, UUID followupId) {}
