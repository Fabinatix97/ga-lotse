/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.schoolentry.domain.model.MeasuringDevice;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface MeasuringDeviceRepository extends JpaRepository<MeasuringDevice, Long> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("FROM MeasuringDevice d WHERE d.externalId = :externalId")
  Optional<MeasuringDevice> findByExternalIdForUpdate(UUID externalId);

  boolean existsByName(String name);

  boolean existsByEquipmentSelector(String equipmentSelector);

  Optional<MeasuringDevice> findByEquipmentSelector(String equipmentSelector);
}
