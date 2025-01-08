/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InformationStatementTemplateRepository
    extends JpaRepository<InformationStatementTemplate, UUID> {
  Optional<InformationStatementTemplate> findByName(String name);
}
