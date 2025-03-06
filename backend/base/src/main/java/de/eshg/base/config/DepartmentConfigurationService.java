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

  @Override
  protected DepartmentConfiguration getInitialConfiguration() throws Exception {
    DepartmentConfiguration departmentConfiguration = new DepartmentConfiguration();
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
