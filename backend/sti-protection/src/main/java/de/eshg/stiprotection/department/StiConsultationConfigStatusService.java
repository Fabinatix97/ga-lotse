/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AbstractConfigStatusService;
import de.eshg.stiprotection.config.HivStiConsultationConfigurationStatusAware;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
class StiConsultationConfigStatusService extends AbstractConfigStatusService {
  StiConsultationConfigStatusService(
      List<HivStiConsultationConfigurationStatusAware> configurationStatusAwares) {
    super(
        configurationStatusAwares.stream()
            .map(
                HivStiConsultationConfigurationStatusAware
                    ::getHivStiConsultationConfigurationStatusAware)
            .toList());
  }
}
