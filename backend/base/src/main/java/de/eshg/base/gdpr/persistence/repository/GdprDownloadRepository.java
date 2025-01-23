/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence.repository;

import de.eshg.base.gdpr.persistence.GdprDownload;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface GdprDownloadRepository
    extends JpaRepository<GdprDownload, Long>, JpaSpecificationExecutor<GdprDownload> {

  @Query("SELECT gd.downloadId FROM GdprDownload gd WHERE gd.downloadId IN :downloadIds")
  List<UUID> findExistingDownloadIds(Collection<UUID> downloadIds);
}
