/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.lib.procedure.domain.repository.TaskRepository;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface InspectionTaskRepository extends TaskRepository<InspectionTask> {

  @Query(
      """
          select i from Inspection i
            where i.calendarEventId in :calendarEventIds
            order by i.calendarEventId
          """)
  List<Inspection> findAllByCalendarEventIdOrderById(Collection<UUID> calendarEventIds);
}
