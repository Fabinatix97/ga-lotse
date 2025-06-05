/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.database;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface MedsAbroadProcedureRepository extends ProcedureRepository<MedsAbroadProcedure> {

  @Query(
      """
    SELECT procedure
    FROM MedsAbroadProcedure procedure
    WHERE procedure.calendarEventId
    IN :calendarEventIds
    ORDER BY procedure.calendarEventId
  """)
  List<MedsAbroadProcedure> findAllByCalendarEventIdOrderById(Collection<UUID> calendarEventIds);
}
