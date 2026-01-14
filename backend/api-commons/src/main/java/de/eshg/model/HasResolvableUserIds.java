/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Set;
import java.util.UUID;

public interface HasResolvableUserIds {

  @JsonIgnore
  Set<UUID> getResolvableUserIds();
}
