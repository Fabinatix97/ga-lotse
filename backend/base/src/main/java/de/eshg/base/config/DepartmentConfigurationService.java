/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import jakarta.annotation.PostConstruct;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class DepartmentConfigurationService {

  private static final Logger log = LoggerFactory.getLogger(DepartmentConfigurationService.class);

  private final DepartmentConfigurationRepository departmentConfigurationRepository;
  private final InitialDepartmentConfigurationDefaults initialDepartmentConfiguration;

  public DepartmentConfigurationService(
      DepartmentConfigurationRepository departmentConfigurationRepository,
      InitialDepartmentConfigurationDefaults initialDepartmentConfiguration) {
    this.departmentConfigurationRepository = departmentConfigurationRepository;
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
  }

  @PostConstruct
  public void init() throws Exception {
    long existingDepartmentConfigurations = departmentConfigurationRepository.count();
    if (existingDepartmentConfigurations == 0) {
      log.info("Initializing department configurations in db.");
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
      departmentConfiguration.setLogo(
          initialDepartmentConfiguration.logo().getContentAsByteArray());
      departmentConfiguration.setSecurityTxt(
          initialDepartmentConfiguration.securityTxt().getContentAsByteArray());
      departmentConfiguration.setSecurityTxtPublicKey(
          initialDepartmentConfiguration.securityTxtPublicKey().getContentAsByteArray());
      departmentConfiguration.setStreetDirectory(
          initialDepartmentConfiguration.streetDirectory().getContentAsByteArray());
      departmentConfiguration.setMunicipalityDirectory(
          initialDepartmentConfiguration.municipalityDirectory().getContentAsByteArray());

      departmentConfigurationRepository.save(departmentConfiguration);
    } else {
      Assert.isTrue(
          existingDepartmentConfigurations == 1,
          "Found more than one department configuration entries in the database.");
    }
  }

  public DepartmentConfiguration getDepartmentConfiguration() {
    List<DepartmentConfiguration> departmentConfigurations =
        departmentConfigurationRepository.findAll();
    Assert.isTrue(
        departmentConfigurations.size() == 1,
        "Found more than one department configuration entries in the database.");

    return departmentConfigurations.getFirst();
  }
}
