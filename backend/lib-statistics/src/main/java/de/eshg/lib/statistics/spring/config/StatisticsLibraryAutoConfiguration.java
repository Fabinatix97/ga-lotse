/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.spring.config;

import de.eshg.lib.statistics.StatisticsController;
import de.eshg.lib.statistics.StatisticsService;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({StatisticsController.class, StatisticsService.class})
public class StatisticsLibraryAutoConfiguration {}
