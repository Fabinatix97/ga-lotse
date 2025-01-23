/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence.repository;

import de.eshg.base.gdpr.persistence.GdprFacility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GdprFacilityRepository extends JpaRepository<GdprFacility, Long> {}
