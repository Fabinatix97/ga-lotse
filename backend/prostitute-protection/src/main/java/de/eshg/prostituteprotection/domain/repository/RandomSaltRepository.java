/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.prostituteprotection.domain.model.RandomSalt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RandomSaltRepository extends JpaRepository<RandomSalt, Long> {}
