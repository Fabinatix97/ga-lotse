/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import de.eshg.config.ConfigurationStatusAware;

public interface HivStiConsultationConfigurationStatusAware extends ConfigurationStatusAware {

  default ConfigurationStatusAware getHivStiConsultationConfigurationStatusAware() {
    return this;
  }
}
