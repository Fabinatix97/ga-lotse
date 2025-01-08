/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.repository;

import de.eshg.base.calendar.persistence.entity.CalendarEventMutex;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarEventMutexRepository extends JpaRepository<CalendarEventMutex, Long> {
  List<CalendarEventMutex> findAllByCalendarExternalIdIn(List<UUID> calendarIds);
}
