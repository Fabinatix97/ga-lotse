/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FacilityRepository
    extends JpaRepository<Facility, Long>, JpaSpecificationExecutor<Facility> {

  Optional<Facility> findByExternalId(UUID externalId);

  Optional<Facility> findByCentralFileStateId(UUID centralFileStatId);

  List<Facility> findAllByCentralFileStateIdIn(List<UUID> centralFileStateIds);
}
