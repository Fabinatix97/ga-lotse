/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mutex.spring;

import de.eshg.mutex.DatabaseMutexService;
import de.eshg.mutex.MutexRepository;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration(before = JpaRepositoriesAutoConfiguration.class)
@AutoConfigurationPackage(basePackageClasses = {MutexRepository.class})
@Import({DatabaseMutexService.class})
public class MutexAutoConfiguration {}
