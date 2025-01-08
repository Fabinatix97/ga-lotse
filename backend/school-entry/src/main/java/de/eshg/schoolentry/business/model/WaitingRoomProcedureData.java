/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.domain.model.WaitingRoom;
import java.time.Instant;
import java.util.UUID;

public record WaitingRoomProcedureData(
    Long internalId,
    UUID externalId,
    ChildData child,
    WaitingRoom waitingRoom,
    Instant modifiedAt) {}
