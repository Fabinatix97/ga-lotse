/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mutex;

import de.cronn.commons.lang.Action;
import java.util.function.Supplier;

public interface MutexService {
  default void doWithLockedMutex(String mutexName, Action action) {
    doWithLockedMutex(mutexName, action.toSupplier());
  }

  <T> T doWithLockedMutex(String mutexName, Supplier<T> supplier);
}
