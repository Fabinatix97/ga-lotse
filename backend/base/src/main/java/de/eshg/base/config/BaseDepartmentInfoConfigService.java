/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.config.mapper.DepartmentInfoMapper.mapToDomain;

import de.eshg.base.config.BaseDepartmentInfoConfigService.MandatoryInitialDepartmentInfo;
import de.eshg.base.config.persistence.BaseDepartmentInfoConfig;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.departmentinfo.AbstractDepartmentInfoConfigService;
import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.initialization.InitialDepartmentInfo;
import de.eshg.config.spring.DepartmentInfoPropertyBinding;
import de.eshg.lib.common.CountryCode;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.SequencedMap;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Component
@EnableConfigurationProperties(MandatoryInitialDepartmentInfo.class)
public class BaseDepartmentInfoConfigService
    extends AbstractDepartmentInfoConfigService<BaseDepartmentInfoConfig> {

  private final MandatoryInitialDepartmentInfo initialDepartmentInfo;

  public BaseDepartmentInfoConfigService(
      MandatoryInitialDepartmentInfo initialDepartmentInfo,
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, auditLogWriter, BaseDepartmentInfoConfig.class);
    this.initialDepartmentInfo = initialDepartmentInfo;
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED)
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.DEPARTMENT_INFO.name(), toConfigurationStatus(getConfig()));
  }

  private ConfigurationStatus toConfigurationStatus(BaseDepartmentInfoConfig config) {
    if (config.isInitialized()) {
      return ConfigurationStatus.COMPLETE;
    } else {
      return ConfigurationStatus.INCOMPLETE;
    }
  }

  @Override
  protected BaseDepartmentInfoConfig getInitialConfiguration() {
    BaseDepartmentInfoConfig baseDepartmentInfoConfig = new BaseDepartmentInfoConfig();
    baseDepartmentInfoConfig.setDepartmentInfo(mapToDomain(initialDepartmentInfo));
    return baseDepartmentInfoConfig;
  }

  @Override
  protected void updateDepartmentInfo(
      BaseDepartmentInfoConfig config, DepartmentInfo departmentInfoUpdate) {
    config.setInitialized(true);
    super.updateDepartmentInfo(config, departmentInfoUpdate);
  }

  boolean isInitialized() {
    return getConfig().isInitialized();
  }

  @Validated
  @ConfigurationProperties(prefix = DepartmentInfoPropertyBinding.DEFAULT_PROPERTY_PREFIX)
  record MandatoryInitialDepartmentInfo(
      @NotBlank String name,
      @NotBlank String abbreviation,
      @NotBlank String street,
      @NotBlank String houseNumber,
      @NotBlank String postalCode,
      @NotBlank String city,
      @NotNull CountryCode country,
      @NotBlank String phoneNumber,
      @NotBlank String homepage,
      @NotBlank String email,
      @NotNull Double latitude,
      @NotNull Double longitude)
      implements InitialDepartmentInfo {}
}
