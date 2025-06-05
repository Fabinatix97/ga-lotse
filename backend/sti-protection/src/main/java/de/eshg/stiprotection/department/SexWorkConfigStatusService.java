/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AbstractConfigStatusService;
import de.eshg.stiprotection.config.SexWorkConfigurationStatusAware;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
class SexWorkConfigStatusService extends AbstractConfigStatusService {
  SexWorkConfigStatusService(List<SexWorkConfigurationStatusAware> configurationStatusAwares) {
    super(
        configurationStatusAwares.stream()
            .map(SexWorkConfigurationStatusAware::getSexWorkConfigurationStatusAware)
            .toList());
  }
}
