/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Component;

@Component
public class OpenDataConfigService extends EshgConfigurationService<OpenDataConfiguration> {

  private static final String CONFIGURATION_ENDPOINT = "OPEN_DATA";
  private final InitialOpenDataConfiguration initialOpenDataConfiguration;

  public OpenDataConfigService(
      InitialOpenDataConfiguration initialOpenDataConfiguration,
      EntityManager entityManager,
      TransactionHelper transactionHelper) {
    super(entityManager, transactionHelper, OpenDataConfiguration.class);
    this.initialOpenDataConfiguration = initialOpenDataConfiguration;
  }

  @Override
  public OpenDataConfiguration getConfig() {
    return super.getConfig();
  }

  @Override
  protected OpenDataConfiguration getInitialConfiguration() throws Exception {
    OpenDataConfiguration openDataConfiguration = new OpenDataConfiguration();
    openDataConfiguration.setAuthor(initialOpenDataConfiguration.author());
    openDataConfiguration.setFallbackLicenseUrl(initialOpenDataConfiguration.fallbackLicenseUrl());
    openDataConfiguration.setTermsOfUse(
        initialOpenDataConfiguration.termsOfUse().getContentAsByteArray());
    return openDataConfiguration;
  }

  @Override
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, ConfigurationStatus.COMPLETE);
  }
}
