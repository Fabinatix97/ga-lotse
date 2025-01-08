/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.GeoShape;
import de.eshg.statistics.persistence.entity.GeoShapeStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeoShapeRepository extends JpaRepository<GeoShape, Long> {
  Optional<GeoShape> findByExternalId(UUID externalId);

  Page<GeoShape> findAllByStatus(GeoShapeStatus status, Pageable pageable);
}
