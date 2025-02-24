/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentConfigurationRepository
    extends JpaRepository<DepartmentConfiguration, Long> {}
