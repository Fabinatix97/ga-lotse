/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.api.ImportStatisticsDto;
import org.springframework.core.io.Resource;

public record ImportResult(ImportStatisticsDto statistics, Resource file) {}
