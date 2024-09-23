/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import org.springframework.stereotype.Component;

@Component
public interface PropertyUpdater<T> {
  void update(T target, T source);
}
