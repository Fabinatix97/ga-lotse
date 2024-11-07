/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.waitingroom;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(name = "WaitingRoom")
public record WaitingRoomDto(@Size(max = 60) String info, WaitingStatusDto status) {}
