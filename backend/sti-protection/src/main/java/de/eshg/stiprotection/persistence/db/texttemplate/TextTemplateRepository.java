/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.texttemplate;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TextTemplateRepository
    extends JpaRepository<TextTemplate, Long>, JpaSpecificationExecutor<TextTemplate> {

  Optional<TextTemplate> findByExternalId(UUID externalId);
}
