/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.spring;

import de.eshg.lib.userflowmetrics.persistence.UserFlow;
import de.eshg.lib.userflowmetrics.persistence.UserFlowRepository;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;

@AutoConfiguration(before = JpaRepositoriesAutoConfiguration.class)
@AutoConfigurationPackage(basePackageClasses = {UserFlow.class, UserFlowRepository.class})
public class UserFlowMetricsDomainModelAutoConfiguration {}
