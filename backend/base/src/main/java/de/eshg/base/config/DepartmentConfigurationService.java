/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.Document;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.util.SequencedMap;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class DepartmentConfigurationService
    extends EshgConfigurationService<DepartmentConfiguration> {

  private static final String CONFIGURATION_ENDPOINT = "DEPARTMENT_CONFIG";
  private final InitialDepartmentConfigurationDefaults initialDepartmentConfiguration;

  public DepartmentConfigurationService(
      InitialDepartmentConfigurationDefaults initialDepartmentConfiguration,
      TransactionHelper transactionHelper,
      EntityManager entityManager) {
    super(entityManager, transactionHelper, DepartmentConfiguration.class);
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
  }

  @Override
  public DepartmentConfiguration getConfig() {
    return super.getConfig();
  }

  public byte[] getLogo() {
    return transactionHelper.executeInReadOnlyTransaction(() -> getConfig().getLogo().getContent());
  }

  public byte[] getSecurityTxt() {
    return transactionHelper.executeInReadOnlyTransaction(
        () -> getConfig().getSecurityTxt().getContent());
  }

  public byte[] getSecurityTxtPublicKey() {
    return transactionHelper.executeInReadOnlyTransaction(
        () -> getConfig().getSecurityTxtPublicKey().getContent());
  }

  public byte[] getStreetDirectory() {
    return transactionHelper.executeInReadOnlyTransaction(
        () -> getConfig().getStreetDirectory().getContent());
  }

  public byte[] getMunicipalityDirectory() {
    return transactionHelper.executeInReadOnlyTransaction(
        () -> getConfig().getMunicipalityDirectory().getContent());
  }

  @Override
  protected DepartmentConfiguration getInitialConfiguration() throws Exception {
    DepartmentConfiguration departmentConfiguration = new DepartmentConfiguration();
    departmentConfiguration.setLogo(mapToDocument(initialDepartmentConfiguration.logo()));
    departmentConfiguration.setSecurityTxt(
        mapToDocument(initialDepartmentConfiguration.securityTxt()));
    departmentConfiguration.setSecurityTxtPublicKey(
        mapToDocument(initialDepartmentConfiguration.securityTxtPublicKey()));
    departmentConfiguration.setStreetDirectory(
        mapToDocument(initialDepartmentConfiguration.streetDirectory()));
    departmentConfiguration.setMunicipalityDirectory(
        mapToDocument(initialDepartmentConfiguration.municipalityDirectory()));
    return departmentConfiguration;
  }

  @Override
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, ConfigurationStatus.COMPLETE);
  }

  private static Document mapToDocument(Resource resource) throws IOException {
    Document document = new Document();
    document.setContent(resource.getContentAsByteArray());
    return document;
  }
}
