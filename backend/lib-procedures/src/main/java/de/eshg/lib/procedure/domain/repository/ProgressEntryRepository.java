/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressEntryRepository
    extends JpaRepository<ProgressEntry, Long>, JpaSpecificationExecutor<ProgressEntry> {

  Optional<ProgressEntry> findByProcedureIdAndExternalId(Long procedureId, UUID externalId);

  Optional<ProgressEntry> findByExternalId(UUID externalId);

  @Query(
      """
          SELECT e FROM ProgressEntry e
          JOIN FETCH e.file as file
          LEFT JOIN FETCH file.attachments
          WHERE e.procedureId = :procedureId""")
  List<ProgressEntry> findAllByProcedureIdAndFetchFileAndAttachments(
      @Param("procedureId") Long procedureId);

  @Override
  @EntityGraph(attributePaths = ProgressEntry_.FILE)
  Page<ProgressEntry> findAll(Specification<ProgressEntry> spec, Pageable pageable);

  @Query(
      value =
          """
            SELECT COUNT(*) FROM ProgressEntry progressEntry
            WHERE progressEntry.procedureId = :procedureId
            AND (
            TREAT(progressEntry as ManualProgressEntry).keyDocumentType = :keyDocumentType
            OR
            TREAT(progressEntry as SystemProgressEntry).keyDocumentType = :keyDocumentType
            )
            """)
  Integer countByProcedureIdAndKeyDocumentType(
      @Param("procedureId") Long procedureId, @Param("keyDocumentType") String keyDocumentType);

  @Query(
      """
        SELECT progressEntry FROM ProgressEntry progressEntry
        LEFT JOIN FETCH progressEntry.file as file
        LEFT JOIN FETCH file.attachments
        WHERE progressEntry.procedureId = :procedureId
        AND progressEntry.id != :id
        AND (
        TREAT(progressEntry as ManualProgressEntry).keyDocumentType = :keyDocumentType
        OR
        TREAT(progressEntry as SystemProgressEntry).keyDocumentType = :keyDocumentType
        )
        """)
  List<ProgressEntry> findAllByProcedureIdAndKeyDocumentTypeAndNotIdFetchingFileAndAttachments(
      @Param("procedureId") Long procedureId,
      @Param("keyDocumentType") String keyDocumentType,
      @Param("id") Long id);
}
