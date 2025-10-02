/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface GdprDownloadPackageRepository
    extends JpaRepository<GdprDownloadPackage, Long>,
        JpaSpecificationExecutor<GdprDownloadPackage> {

  Optional<GdprDownloadPackage> findByExternalId(UUID externalId);

  @Query(
      "select g.externalId as downloadId from GdprDownloadPackage g where g.externalId in :externalIds")
  List<GdprDownloadPackageInfo> findInfoByExternalIdIn(Collection<UUID> externalIds);

  @Query(
      "select g.businessProcedureId from GdprDownloadPackage g where g.externalId in :externalIds")
  List<UUID> findBusinessProcedureIdsByExternalIdIn(Collection<UUID> externalIds);

  boolean existsByBusinessProcedureIdAndExternalIdIn(
      UUID businessProcedureId, Collection<UUID> externalIds);

  @Transactional
  @Modifying
  @Query("delete from GdprDownloadPackage g where g.externalId in :externalIds")
  int deleteAllByExternalIdIn(Collection<UUID> externalIds);

  List<GdprDownloadPackage> findAllByIdentificationDataHashIsNull();
}
