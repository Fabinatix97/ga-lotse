/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.ProgressEntry;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
          JOIN FETCH e.file file
          LEFT JOIN FETCH treat(file as Image).metaData
          LEFT JOIN FETCH treat(file as Pdf).metaData
          LEFT JOIN FETCH treat(file as Mail).metaData
          LEFT JOIN FETCH file.attachments attachment
          LEFT JOIN FETCH treat(attachment as Image).metaData
          LEFT JOIN FETCH treat(attachment as Pdf).metaData
          WHERE e.procedureId = :procedureId
      """)
  List<ProgressEntry> findAllByProcedureIdAndFetchFile(@Param("procedureId") Long procedureId);

  @Override
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
        LEFT JOIN FETCH treat(file as Image).metaData
        LEFT JOIN FETCH treat(file as Pdf).metaData
        LEFT JOIN FETCH treat(file as Mail).metaData
        WHERE progressEntry.procedureId = :procedureId
        AND progressEntry.id != :id
        AND file is not null
        AND not file.deleted
        AND (
        TREAT(progressEntry as ManualProgressEntry).keyDocumentType = :keyDocumentType
        OR
        TREAT(progressEntry as SystemProgressEntry).keyDocumentType = :keyDocumentType
        )
        ORDER BY
          COALESCE(TREAT(progressEntry as ManualProgressEntry).keyDocumentVersion, TREAT(progressEntry as SystemProgressEntry).keyDocumentVersion) DESC,
          progressEntry.id DESC
        """)
  List<ProgressEntry> findAllByProcedureIdAndKeyDocumentTypeAndNotIdFetchingFile(
      @Param("procedureId") Long procedureId,
      @Param("keyDocumentType") String keyDocumentType,
      @Param("id") Long id);

  @Query(
      """
        SELECT progressEntry FROM ProgressEntry progressEntry
        LEFT JOIN FETCH treat(progressEntry as ProcessedInboxProgressEntry).inboxProcedure
        LEFT JOIN FETCH progressEntry.file file
        LEFT JOIN FETCH treat(file as Image).metaData
        LEFT JOIN FETCH treat(file as Pdf).metaData
        LEFT JOIN FETCH treat(file as Mail).metaData
        WHERE progressEntry IN :progressEntries
        """)
  List<ProgressEntry> fetchFilesMetaDataAndInboxProcedure(
      @Param("progressEntries") List<ProgressEntry> progressEntries, Sort sort);
}
