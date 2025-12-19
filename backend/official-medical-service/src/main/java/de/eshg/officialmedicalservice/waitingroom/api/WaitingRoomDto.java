/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.waitingroom.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WaitingRoom")
public record WaitingRoomDto(String info, WaitingStatusDto status) {}
