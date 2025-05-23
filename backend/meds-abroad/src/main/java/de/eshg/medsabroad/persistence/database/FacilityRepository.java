/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.database;

import org.springframework.data.jpa.repository.JpaRepository;

@SuppressWarnings("unused")
public interface FacilityRepository extends JpaRepository<Facility, Long> {}
