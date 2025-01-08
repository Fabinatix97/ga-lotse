/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ManualProgressEntryRepository
    extends JpaRepository<ManualProgressEntry, Long>,
        JpaSpecificationExecutor<ManualProgressEntry> {

  boolean existsByProcedureIdAndKeyDocumentTypeAndFileFileTypeNot(
      Long procedureId, String keyDocumentType, ProcedureFileType fileType);

  Optional<ManualProgressEntry> findByExternalId(UUID externalId);
}
