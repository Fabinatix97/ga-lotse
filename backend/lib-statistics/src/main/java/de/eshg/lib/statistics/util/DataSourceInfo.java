/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.util;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import java.util.UUID;

public record DataSourceInfo(
    UUID id, String name, DataSourceSensitivity sensitivity, boolean canBeAnonymized) {}
