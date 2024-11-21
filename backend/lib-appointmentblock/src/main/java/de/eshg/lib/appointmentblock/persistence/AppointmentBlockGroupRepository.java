/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentBlockGroupRepository
    extends JpaRepository<AppointmentBlockGroup, Long>,
        JpaSpecificationExecutor<AppointmentBlockGroup> {

  @Modifying
  @Query(
      "update AppointmentBlockGroup p set p.locationId = :newLocationId where p.locationId = :oldLocationId")
  int replaceLocationId(
      @Param("oldLocationId") UUID oldLocationId, @Param("newLocationId") UUID newLocationId);
}
