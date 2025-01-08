/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.otherservicetemplate.persistence.entity;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtherServiceTemplateRepository extends JpaRepository<OtherServiceTemplate, UUID> {
  Optional<OtherServiceTemplate> findByDescription(String description);
}
