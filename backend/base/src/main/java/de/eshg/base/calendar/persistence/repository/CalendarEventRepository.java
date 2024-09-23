/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.repository;

import de.eshg.base.calendar.persistence.entity.CalendarEvent;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CalendarEventRepository
    extends JpaRepository<CalendarEvent, Long>, JpaSpecificationExecutor<CalendarEvent> {

  Optional<CalendarEvent> findByExternalId(UUID externalId);

  CalendarEvent getByExternalId(UUID externalId);

  void deleteByExternalId(UUID externalId);

  List<CalendarEvent> findAllByExternalIdInOrderById(List<UUID> externalIds);
}
