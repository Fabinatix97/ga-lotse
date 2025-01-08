/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.model;

public interface LockableEntity {
  void lock(boolean locked);
}
