/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InspectionIncidentRepository extends JpaRepository<InspectionIncident, UUID> {

  Optional<InspectionIncident> findByIncidentExternalId(UUID externalId);
}
