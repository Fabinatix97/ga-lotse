/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label.persistence.repository;

import de.eshg.base.label.persistence.entity.Label;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LabelRepository
    extends JpaRepository<Label, UUID>, JpaSpecificationExecutor<Label> {

  Optional<Label> findByName(String name);

  List<Label> findByNameContainingIgnoreCaseOrderByNameAsc(String name);
}
