/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.persistence.repository;

import de.eshg.base.calendar.persistence.entity.Calendar;
import de.eshg.base.calendar.persistence.entity.CalendarType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarRepository extends JpaRepository<Calendar, Long> {
  List<Calendar> findAllByTypeOrderById(CalendarType type);

  List<Calendar> findAllByOrderById();

  List<Calendar> findAllByExternalIdInOrderById(List<UUID> externalIds);

  Optional<Calendar> findByUserId(UUID userId);

  Optional<Calendar> findByResourceId(UUID resourceId);

  List<Calendar> findAllByUserIdIn(Collection<UUID> userIds);

  List<Calendar> findAllByResourceIdInOrderById(List<UUID> resourceIds);
}
