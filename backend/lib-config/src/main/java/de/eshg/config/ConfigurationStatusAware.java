/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import java.util.SequencedMap;

public interface ConfigurationStatusAware {
  SequencedMap<String, ConfigurationStatus> getConfigurationStatus();
}
