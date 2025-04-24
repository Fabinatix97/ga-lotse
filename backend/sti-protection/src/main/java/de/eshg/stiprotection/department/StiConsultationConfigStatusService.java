/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.config.AbstractConfigStatusService;
import de.eshg.config.EshgConfigurationService;
import de.eshg.stiprotection.persistence.db.Concern;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
class StiConsultationConfigStatusService extends AbstractConfigStatusService {
  StiConsultationConfigStatusService(
      @ConfigConcernQualifier(concern = Concern.HIV_STI_CONSULTATION)
          List<EshgConfigurationService<?>> configurationServices) {
    super(configurationServices);
  }
}
