/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.persistence.repository;

import de.eshg.centralrepository.persistence.entity.IdVersionPK;
import de.eshg.centralrepository.persistence.entity.VersionedEntryMetadata;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VersionedEntryMetadataRepository
    extends JpaRepository<VersionedEntryMetadata, IdVersionPK> {
  VersionedEntryMetadata findFirstByPk(@NotNull IdVersionPK pk);

  /**
   * @return get the entry with the highest version for the supplied id
   */
  VersionedEntryMetadata findFirstByDeletedFalseAndPkIdOrderByPkVersionDesc(long id);

  /**
   * @return get the entry with the highest version for the supplied id, given it has the supplied
   *     names and deleted state
   */
  VersionedEntryMetadata findFirstByDeletedAndModuleNameAndObjectNameAndPkIdOrderByPkVersionDesc(
      @NotNull boolean deleted,
      @NotNull String moduleName,
      @NotNull String objectName,
      @NotNull Long id);

  List<VersionedEntryMetadata> findAllByDeletedAndModuleNameAndObjectNameAndPkId(
      @NotNull boolean deleted,
      @NotNull String moduleName,
      @NotNull String objectName,
      @NotNull Long id);

  /**
   * @param tags a string to search for in the tags; if this is empty, we look for entries without
   *     tags
   */
  @Query(
      """
              SELECT e
              FROM VersionedEntryMetadata e
              WHERE e.deleted = :deleted
              AND e.moduleName = :moduleName
              AND (:objectName is null OR e.objectName = :objectName)
              AND (:category is null OR e.category = :category)
              AND (:tags is null OR :tags <> '' OR e.tags = '')
              AND (:tags is null OR :tags = '' OR e.tags like %:tags%)""")
  List<VersionedEntryMetadata> findAllBy(
      @NotNull @Param("moduleName") String moduleName,
      @Param("objectName") String objectName,
      @Param("category") String category,
      @Param("tags") String tags,
      @Param("deleted") boolean deleted);

  /**
   * @see #findAllBy
   */
  @Query(
      """
            SELECT a
            FROM VersionedEntryMetadata a
            LEFT OUTER JOIN VersionedEntryMetadata b
                ON b.deleted = :deleted
                AND b.moduleName = :moduleName
                AND (:objectName is null OR b.objectName = :objectName)
                AND (:category is null OR b.category = :category)
                AND (:tags is null OR :tags <> '' OR b.tags = '')
                AND (:tags is null OR :tags = '' OR b.tags like %:tags%)
                AND a.pk.id = b.pk.id
                AND a.pk.version < b.pk.version
            WHERE b.pk.id IS NULL
            AND a.deleted = :deleted
            AND a.moduleName = :moduleName
            AND (:objectName is null OR a.objectName = :objectName)
            AND (:category is null OR a.category = :category)
            AND (:tags is null OR :tags <> '' OR a.tags = '')
            AND (:tags is null OR :tags = '' OR a.tags like %:tags%)""")
  List<VersionedEntryMetadata> findOnlyNewestBy(
      @NotNull @Param("moduleName") String moduleName,
      @Param("objectName") String objectName,
      @Param("category") String category,
      @Param("tags") String tags,
      @Param("deleted") boolean deleted);

  /**
   * @return the highest id + 1 or 0 if there is no element
   */
  @Query(
      value = "SELECT COALESCE(MAX(e.id), -1) + 1 FROM versioned_entry_metadata e",
      nativeQuery = true)
  Long getNextPkId();

  @Query(
      value =
          "SELECT COALESCE(MAX(e.version), -1)  FROM versioned_entry_metadata e where e.id=:id and e.deleted = true",
      nativeQuery = true)
  Integer getLastPkVersionDeleted(Long id);

  @Query(
      value =
          """
                    SELECT COALESCE(MAX(CASE WHEN e.deleted = true THEN e.version END), -1),
                           COALESCE(MAX(CASE WHEN e.deleted = false THEN e.version END), -1)
                    FROM versioned_entry_metadata e
                    WHERE e.id = :id
                    """,
      nativeQuery = true)
  List<Integer> getNewestDeletedAndNonDeletedById(Long id);

  @Query(
      value =
          "SELECT COALESCE(MAX(e.version), -1) FROM versioned_entry_metadata e where e.id=:id and e.deleted = false",
      nativeQuery = true)
  Integer getLastPkVersionNotDeleted(Long id);

  @Modifying
  @Query(
      """
            UPDATE VersionedEntryMetadata e
            SET e.deleted = true, e.deletedAt = :deletedAt, e.deletedBy = :deletedBy
            WHERE e.pk.id = :id AND (:version is null OR e.pk.version = :version)
            AND e.deleted = false AND e.moduleName = :moduleName AND e.objectName = :objectName""")
  int setAsDeletedByPk(
      @NotNull @Param("moduleName") String moduleName,
      @NotNull @Param("objectName") String objectName,
      @NotNull @Param("id") Long id,
      @Param("version") Integer version,
      @NotNull @Param("deletedAt") Instant deletedAt,
      @NotNull @Param("deletedBy") String deletedBy);

  @Override
  default <S extends VersionedEntryMetadata> S saveAndFlush(S entity) {
    throw savingNotAllowedException();
  }

  @Override
  default <S extends VersionedEntryMetadata> List<S> saveAllAndFlush(Iterable<S> entities) {
    throw savingNotAllowedException();
  }

  @Override
  default <S extends VersionedEntryMetadata> S save(S entity) {
    throw savingNotAllowedException();
  }

  @Override
  default <S extends VersionedEntryMetadata> List<S> saveAll(Iterable<S> entities) {
    throw savingNotAllowedException();
  }

  private static IllegalStateException savingNotAllowedException() {
    return new IllegalStateException(
        "Saving metadata without content is not supported. Use the ContentRepository.");
  }
}
