/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.Diagram;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagramRepository extends JpaRepository<Diagram, Long> {
  Optional<Diagram> findByExternalId(UUID externalId);
}
