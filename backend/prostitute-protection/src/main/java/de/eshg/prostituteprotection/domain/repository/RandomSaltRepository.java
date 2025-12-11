/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.prostituteprotection.domain.model.RandomSalt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RandomSaltRepository extends JpaRepository<RandomSalt, Long> {}
