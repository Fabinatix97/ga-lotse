/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.persistence.repository;

import de.eshg.base.inventory.persistence.entity.InventoryItem;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;

public interface InventoryRepository
    extends JpaRepository<InventoryItem, UUID>, JpaSpecificationExecutor<InventoryItem> {
  boolean existsByName(String name);
}
