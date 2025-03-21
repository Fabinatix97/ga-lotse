/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.departmentinfo.mapper.DepartmentInfoMapper.mapToDomain;

import de.eshg.base.config.BaseDepartmentInfoConfigService.MandatoryInitialDepartmentInfo;
import de.eshg.base.config.persistence.BaseDepartmentInfoConfig;
import de.eshg.departmentinfo.AbstractDepartmentInfoConfigService;
import de.eshg.departmentinfo.initialization.InitialDepartmentInfo;
import de.eshg.departmentinfo.spring.DepartmentInfoPropertyBinding;
import de.eshg.lib.common.CountryCode;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@EnableConfigurationProperties(MandatoryInitialDepartmentInfo.class)
public class BaseDepartmentInfoConfigService
    extends AbstractDepartmentInfoConfigService<BaseDepartmentInfoConfig> {

  private final MandatoryInitialDepartmentInfo initialDepartmentInfo;

  public BaseDepartmentInfoConfigService(
      MandatoryInitialDepartmentInfo initialDepartmentInfo,
      EntityManager entityManager,
      TransactionHelper transactionHelper) {
    super(entityManager, transactionHelper, BaseDepartmentInfoConfig.class);
    this.initialDepartmentInfo = initialDepartmentInfo;
  }

  @Override
  protected BaseDepartmentInfoConfig getInitialConfiguration() {
    BaseDepartmentInfoConfig baseDepartmentInfoConfig = new BaseDepartmentInfoConfig();
    baseDepartmentInfoConfig.setDepartmentInfo(mapToDomain(initialDepartmentInfo));
    return baseDepartmentInfoConfig;
  }

  @Override
  public BaseDepartmentInfoConfig getConfig() {
    return super.getConfig();
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
