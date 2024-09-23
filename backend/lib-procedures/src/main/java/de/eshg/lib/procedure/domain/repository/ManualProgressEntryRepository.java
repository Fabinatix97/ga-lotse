/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.FileType;
import de.eshg.lib.procedure.domain.model.KeyDocumentType;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ManualProgressEntryRepository
    extends JpaRepository<ManualProgressEntry, Long>,
        JpaSpecificationExecutor<ManualProgressEntry> {

  @Query(
      """
        SELECT e FROM ManualProgressEntry e
        LEFT JOIN FETCH e.file as file
        LEFT JOIN FETCH file.attachments
        WHERE e.procedureId = :procedureId
        AND e.keyDocumentType = :keyDocumentType
        AND e.id != :id
        """)
  List<ManualProgressEntry>
      findAllByProcedureIdAndKeyDocumentTypeAndNotIdFetchingFileAndAttachments(
          @Param("procedureId") Long procedureId,
          @Param("keyDocumentType") KeyDocumentType keyDocumentType,
          @Param("id") Long id);

  @Query(
      value =
          """
  SELECT count(*) FROM manual_progress_entry mpe
  LEFT JOIN progress_entry pe ON mpe.id = pe.id
  WHERE pe.procedure_id = :procedureId AND cast(mpe.key_document_type as text) = :#{#keyDocumentType.name()}""",
      nativeQuery = true)
  Integer countByProcedureIdAndKeyDocumentType(
      @Param("procedureId") Long procedureId,
      @Param("keyDocumentType") KeyDocumentType keyDocumentType);

  boolean existsByProcedureIdAndKeyDocumentTypeAndFileFileTypeNot(
      Long procedureId, KeyDocumentType keyDocumentType, FileType fileType);

  Optional<ManualProgressEntry> findByExternalId(UUID externalId);
}
