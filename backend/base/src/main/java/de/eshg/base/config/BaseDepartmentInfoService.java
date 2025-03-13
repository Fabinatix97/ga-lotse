/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.BaseDepartmentInfoService.MandatoryInitialDepartmentInfo;
import de.eshg.departmentinfo.AbstractDepartmentInfoService;
import de.eshg.departmentinfo.domain.DepartmentInfo;
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
public class BaseDepartmentInfoService extends AbstractDepartmentInfoService<DepartmentInfo> {

  private final MandatoryInitialDepartmentInfo initialDepartmentInfo;

  public BaseDepartmentInfoService(
      MandatoryInitialDepartmentInfo initialDepartmentInfo,
      EntityManager entityManager,
      TransactionHelper transactionHelper) {
    super(entityManager, transactionHelper, DepartmentInfo.class);
    this.initialDepartmentInfo = initialDepartmentInfo;
  }

  @Override
  protected DepartmentInfo getInitialConfiguration() throws Exception {
    DepartmentInfo departmentInfo = new DepartmentInfo();

    departmentInfo.setName(initialDepartmentInfo.name());
    departmentInfo.setAbbreviation(initialDepartmentInfo.abbreviation());
    departmentInfo.setStreet(initialDepartmentInfo.street());
    departmentInfo.setHouseNumber(initialDepartmentInfo.houseNumber());
    departmentInfo.setPostalCode(initialDepartmentInfo.postalCode());
    departmentInfo.setCity(initialDepartmentInfo.city());
    departmentInfo.setCountry(initialDepartmentInfo.country());
    departmentInfo.setPhoneNumber(initialDepartmentInfo.phoneNumber());
    departmentInfo.setHomepage(initialDepartmentInfo.homepage());
    departmentInfo.setEmail(initialDepartmentInfo.email());
    departmentInfo.setLongitude(initialDepartmentInfo.longitude());
    departmentInfo.setLatitude(initialDepartmentInfo.latitude());

    return departmentInfo;
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
