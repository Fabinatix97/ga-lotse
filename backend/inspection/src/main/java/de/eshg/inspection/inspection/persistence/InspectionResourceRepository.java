/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface InspectionResourceRepository
    extends JpaRepository<InspectionResource, Long>, JpaSpecificationExecutor<InspectionResource> {

  @Query(
      """
                select i from InspectionResource i
                  where i.calendarEventId in :calendarEventIds
                  order by i.calendarEventId
                """)
  List<InspectionResource> findAllByCalendarEventIdOrderById(Collection<UUID> calendarEventIds);
}
