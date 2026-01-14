/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.repository;

import de.eshg.base.centralfile.persistence.entity.PersonWithoutDateOfBirth;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface PersonWithoutDateOfBirthRepository
    extends JpaRepository<PersonWithoutDateOfBirth, UUID> {
  Optional<PersonWithoutDateOfBirth> findByExternalId(UUID uuid);

  List<PersonWithoutDateOfBirth> findAllByExternalIdIn(List<UUID> ids);

  @Transactional
  @Modifying
  int deleteByDeleteAtBefore(Instant expirationTime);
}
