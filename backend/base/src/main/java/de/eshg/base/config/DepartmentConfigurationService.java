/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

@Component
public class DepartmentConfigurationService
    extends EshgConfigurationService<DepartmentConfiguration> {

  private final InitialDepartmentConfigurationDefaults initialDepartmentConfiguration;

  public DepartmentConfigurationService(
      InitialDepartmentConfigurationDefaults initialDepartmentConfiguration,
      TransactionHelper transactionHelper,
      EntityManager entityManager) {
    super(entityManager, transactionHelper, DepartmentConfiguration.class);
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
  }

  protected DepartmentConfiguration getInitialConfiguration() throws Exception {
    DepartmentConfiguration departmentConfiguration = new DepartmentConfiguration();
    departmentConfiguration.setName(initialDepartmentConfiguration.name());
    departmentConfiguration.setAbbreviation(initialDepartmentConfiguration.abbreviation());
    departmentConfiguration.setStreet(initialDepartmentConfiguration.street());
    departmentConfiguration.setHouseNumber(initialDepartmentConfiguration.houseNumber());
    departmentConfiguration.setPostalCode(initialDepartmentConfiguration.postalCode());
    departmentConfiguration.setCity(initialDepartmentConfiguration.city());
    departmentConfiguration.setCountry(initialDepartmentConfiguration.country());
    departmentConfiguration.setPhoneNumber(initialDepartmentConfiguration.phoneNumber());
    departmentConfiguration.setHomepage(initialDepartmentConfiguration.homepage());
    departmentConfiguration.setEmail(initialDepartmentConfiguration.email());
    departmentConfiguration.setLatitude(initialDepartmentConfiguration.latitude());
    departmentConfiguration.setLongitude(initialDepartmentConfiguration.longitude());
    departmentConfiguration.setLogo(initialDepartmentConfiguration.logo().getContentAsByteArray());
    departmentConfiguration.setSecurityTxt(
        initialDepartmentConfiguration.securityTxt().getContentAsByteArray());
    departmentConfiguration.setSecurityTxtPublicKey(
        initialDepartmentConfiguration.securityTxtPublicKey().getContentAsByteArray());
    departmentConfiguration.setStreetDirectory(
        initialDepartmentConfiguration.streetDirectory().getContentAsByteArray());
    departmentConfiguration.setMunicipalityDirectory(
        initialDepartmentConfiguration.municipalityDirectory().getContentAsByteArray());
    return departmentConfiguration;
  }
}
