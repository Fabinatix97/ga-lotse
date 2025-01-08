/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import java.util.UUID;

public interface AugmentableEvent<T> {
  EventTypeDto type();

  UUID id();

  T copyWithMetadata(EventMetaData metaData);
}
