/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mutex;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

public interface MutexRepository extends JpaRepository<Mutex, String> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Mutex findByName(String name);
}
