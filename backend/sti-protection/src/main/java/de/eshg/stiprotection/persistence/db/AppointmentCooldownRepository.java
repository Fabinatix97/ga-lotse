/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentCooldownRepository extends JpaRepository<AppointmentCooldown, Long> {

  Page<AppointmentCooldown> findByCreatedAtBefore(Instant retentionTime, Pageable page);

  List<AppointmentCooldown> findAllByType(AppointmentType type);

  Optional<AppointmentCooldown> findByAppointmentStartAndAppointmentEndAndType(
      Instant appointmentStart, Instant appointmentEnd, AppointmentType type);
}
