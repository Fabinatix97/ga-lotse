/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import de.eshg.config.ConfigurationStatusAware;

public interface SexWorkConfigurationStatusAware extends ConfigurationStatusAware {

  default ConfigurationStatusAware getSexWorkConfigurationStatusAware() {
    return this;
  }
}
