/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.inspection.config.mapper.InspectionPropertiesConfigAuditLogMapper;
import de.eshg.inspection.config.persistence.InitialInspectionPropertiesConfiguration;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfiguration;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfigurationProvider;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class InspectionPropertiesConfigService
    extends EshgConfigurationService<InspectionPropertiesConfiguration> {

  public static final String CONFIGURATION_ENDPOINT = "INSPECTION";

  private final InitialInspectionPropertiesConfiguration initialInspectionPropertiesConfiguration;
  private final AuditLogWriter auditLogWriter;
  private final TransactionHelper transactionHelper;
  private final FacilityClient facilityClient;

  public InspectionPropertiesConfigService(
      InitialInspectionPropertiesConfiguration initialInspectionPropertiesConfiguration,
      EntityManager entityManager,
      AuditLogWriter auditLogWriter,
      TransactionHelper transactionHelper,
      FacilityClient facilityClient) {
    super(entityManager, transactionHelper, InspectionPropertiesConfiguration.class);
    this.initialInspectionPropertiesConfiguration = initialInspectionPropertiesConfiguration;
    this.auditLogWriter = auditLogWriter;
    this.transactionHelper = transactionHelper;
    this.facilityClient = facilityClient;
  }

  @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
  public InspectionPropertiesConfiguration getConfiguration() {
    return getConfig();
  }

  @Override
  protected InspectionPropertiesConfiguration getInitialConfiguration() throws Exception {
    InspectionPropertiesConfiguration inspectionPropertiesConfiguration =
        new InspectionPropertiesConfiguration();

    inspectionPropertiesConfiguration.setFacilityFileNumberMethod(
        initialInspectionPropertiesConfiguration.facilityFileNumberMethod());

    return inspectionPropertiesConfiguration;
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    ConfigurationStatus configurationStatus = determineConfigurationStatus();
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, configurationStatus);
  }

  @Transactional(propagation = Propagation.REQUIRED)
  public void updateConfiguration(InspectionPropertiesConfigurationProvider updateConfig) {
    if (updateConfig != null) {
      InspectionPropertiesConfiguration currentConfig = getConfig();

      auditLogWriter.writeChangeToAuditLog(
          "inspectionPropertiesConfiguration",
          InspectionPropertiesConfigAuditLogMapper.getRelevantFieldsForLogging(currentConfig),
          InspectionPropertiesConfigAuditLogMapper.getRelevantFieldsForLogging(updateConfig));

      currentConfig.setFacilityFileNumberMethod(updateConfig.getFacilityFileNumberMethod());
      currentConfig.setInitialized(true);
    }
  }

  private ConfigurationStatus determineConfigurationStatus() {
    InspectionPropertiesConfiguration config = getConfig();
    if (!(config.isInitialized())) {
      return ConfigurationStatus.INCOMPLETE;
    }
    return ConfigurationStatus.COMPLETE;
  }

  @VisibleForTesting
  public void patchConfiguration(InspectionPropertiesConfigurationProvider patchConfig) {
    transactionHelper.executeInTransaction(
        () -> {
          // no audit log, no change of initialized flag
          InspectionPropertiesConfiguration currentConfig = getConfig();
          currentConfig.setFacilityFileNumberMethod(patchConfig.getFacilityFileNumberMethod());
        });
  }
}
