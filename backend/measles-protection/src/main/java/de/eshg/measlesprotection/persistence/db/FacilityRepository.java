/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import org.springframework.data.jpa.repository.JpaRepository;

@SuppressWarnings("unused")
public interface FacilityRepository extends JpaRepository<Facility, Long> {}
