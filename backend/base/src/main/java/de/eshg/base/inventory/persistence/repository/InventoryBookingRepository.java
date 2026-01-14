/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.persistence.repository;

import de.eshg.base.inventory.persistence.entity.InventoryItem;
import de.eshg.base.inventory.persistence.entity.InventoryItemBooking;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryBookingRepository extends JpaRepository<InventoryItemBooking, Long> {
  Page<InventoryItemBooking> findAllByInventoryItem(InventoryItem item, Pageable page);

  Optional<InventoryItemBooking> findByInventoryItemIdAndId(UUID inventoryId, long bookingId);
}
