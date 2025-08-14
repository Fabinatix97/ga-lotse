/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InspectionRelatedFacilityRepository
    extends JpaRepository<InspectionRelatedFacility, Long> {
  Optional<InspectionRelatedFacility> findByCentralFileStateId(UUID centralFileStateId);

  List<InspectionRelatedFacility> findAllByCentralFileStateIdIn(List<UUID> centralFileStateId);
}
