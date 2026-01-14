/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence.repository;

import de.eshg.base.gdpr.persistence.DownloadPackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DownloadPackageRepository extends JpaRepository<DownloadPackage, Long> {}
