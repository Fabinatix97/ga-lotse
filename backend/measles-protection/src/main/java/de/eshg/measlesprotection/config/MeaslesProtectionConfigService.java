/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
public class MeaslesProtectionConfigService
    extends EshgConfigurationService<MeaslesProtectionConfiguration> {

  private final InitialMeaslesProtectionConfiguration initialMeaslesProtectionConfiguration;

  protected MeaslesProtectionConfigService(
      InitialMeaslesProtectionConfiguration initialMeaslesProtectionConfiguration,
      EntityManager entityManager,
      TransactionHelper transactionHelper) {
    super(entityManager, transactionHelper, MeaslesProtectionConfiguration.class);
    this.initialMeaslesProtectionConfiguration = initialMeaslesProtectionConfiguration;
  }

  @Override
  protected MeaslesProtectionConfiguration getInitialConfiguration() throws Exception {
    MeaslesProtectionConfiguration measlesProtectionConfiguration =
        new MeaslesProtectionConfiguration();
    measlesProtectionConfiguration.setPrivacyNotice(
        initialMeaslesProtectionConfiguration.privacyNotice().getContentAsByteArray());
    measlesProtectionConfiguration.setPrivacyPolicy(
        initialMeaslesProtectionConfiguration.privacyPolicy().getContentAsByteArray());
    return measlesProtectionConfiguration;
  }
}
