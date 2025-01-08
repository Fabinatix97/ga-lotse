/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.persistence.repository;

import de.eshg.base.resource.persistence.entity.Resource;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ResourceRepository
    extends JpaRepository<Resource, UUID>, JpaSpecificationExecutor<Resource> {
  boolean existsByName(String name);
}
