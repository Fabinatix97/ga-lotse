/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport.model;

import de.eshg.lib.xlsximport.api.ImportStatisticsDto;
import org.springframework.core.io.Resource;

public record ImportResult(ImportStatisticsDto statistics, Resource file) {}
