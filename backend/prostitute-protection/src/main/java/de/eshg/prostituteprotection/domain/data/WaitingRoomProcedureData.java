/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.data;

import de.eshg.prostituteprotection.api.UserNameDto;
import de.eshg.prostituteprotection.domain.model.WaitingRoom;
import java.time.Instant;
import java.util.UUID;

public record WaitingRoomProcedureData(
    UUID externalId,
    String alias,
    UserNameDto consultant,
    WaitingRoom waitingRoom,
    Instant modifiedAt) {}
