/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileContent;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FileRepository extends JpaRepository<File, Long>, JpaSpecificationExecutor<File> {

  Optional<File> findByExternalIdAndDeletedFalse(UUID externalId);

  @Query("select f.fileContent from File f where f.externalId = :externalId and f.deleted = false")
  Optional<FileContent> findFileContentByExternalIdAndDeletedFalse(
      @Param("externalId") UUID externalId);
}
