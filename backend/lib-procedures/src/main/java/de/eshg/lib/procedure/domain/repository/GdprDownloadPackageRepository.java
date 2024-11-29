/*
 * Copyright 2024 cronn GmbH
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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GdprDownloadPackageRepository
    extends JpaRepository<GdprDownloadPackage, Long>,
        JpaSpecificationExecutor<GdprDownloadPackage> {

  Optional<GdprDownloadPackage> findByExternalId(UUID externalId);

  Optional<GdprDownloadPackage> findByBusinessProcedureId(UUID businessProcedureId);

  @Query(
      "select g.externalId as downloadId from GdprDownloadPackage g where g.externalId in :externalIds")
  List<GdprDownloadPackageInfo> findInfoByExternalIdIn(Collection<UUID> externalIds);

  @Query(
      """
    select d.businessProcedureId from GdprDownloadPackage d
    where d.businessProcedureId IN :businessProcedureIds
    """)
  List<UUID> findProcedureIds(@Param("businessProcedureIds") Collection<UUID> businessProcedureIds);
}
