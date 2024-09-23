/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model;

import java.util.UUID;

public sealed interface EntityWithExternalId
    permits BaseEntityWithExternalId, SequencedBaseEntityWithExternalId, GloballyUniqueEntityBase {
  UUID getExternalId();
}
