/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfo;
import de.eshg.base.config.api.InternationalMarkdownInfo;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.base.department.MarkdownName;
import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.util.SequencedMap;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class DepartmentConfigurationService
    extends EshgConfigurationService<DepartmentConfiguration> {

  private static final String CONFIGURATION_ENDPOINT = "DEPARTMENT_CONFIG";
  private final InitialDepartmentConfiguration initialDepartmentConfiguration;
  private final MarkdownMapper markdownMapper;

  public DepartmentConfigurationService(
      InitialDepartmentConfiguration initialDepartmentConfiguration,
      TransactionHelper transactionHelper,
      EntityManager entityManager,
      MarkdownMapper markdownMapper) {
    super(entityManager, transactionHelper, DepartmentConfiguration.class);
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
    this.markdownMapper = markdownMapper;
  }

  @Override
  public DepartmentConfiguration getConfig() {
    return super.getConfig();
  }

  public byte[] getLogo() {
    return transactionHelper.executeInReadOnlyTransaction(() -> getConfig().getLogo().getContent());
  }

  public byte[] getStreetDirectory() {
    return transactionHelper.executeInReadOnlyTransaction(
        () -> getConfig().getStreetDirectory().getContent());
  }

  public byte[] getMunicipalityDirectory() {
    return transactionHelper.executeInReadOnlyTransaction(
        () -> getConfig().getMunicipalityDirectory().getContent());
  }

  public byte[] getMarkdownWithGermanFallback(MarkdownName markdownName, Language language) {
    MultiLangDocument multiLangDocument = getMarkdown(markdownName);
    if (language == Language.ENGLISH && multiLangDocument.getEn() != null) {
      return multiLangDocument.getEn().getContent();
    } else {
      return multiLangDocument.getDe().getContent();
    }
  }

  public byte[] getSpecificMarkdownOrThrow(MarkdownName markdownName, Language language) {
    Document document =
        switch (language) {
          case Language.GERMAN -> getMarkdown(markdownName).getDe();
          case Language.ENGLISH -> getMarkdown(markdownName).getEn();
        };
    if (document != null) {
      return document.getContent();
    } else {
      throw new NotFoundException("Markdown %s (%s) not found".formatted(markdownName, language));
    }
  }

  private MultiLangDocument getMarkdown(MarkdownName markdownName) {
    return switch (markdownName) {
      case CitizenPortalMarkdownName citizenPortalMarkdownName ->
          switch (citizenPortalMarkdownName) {
            case ACCESSIBILITY -> getConfig().getCitizenPortalAccessibilityStatementMarkdown();
            case IMPRINT -> getConfig().getImprintMarkdown();
            case PRIVACY -> getConfig().getCitizenPortalPrivacyPolicyMarkdown();
            case ACKNOWLEDGEMENTS -> getConfig().getAcknowledgementsMarkdown();
          };
      case EmployeePortalMarkdownName employeePortalMarkdownName ->
          switch (employeePortalMarkdownName) {
            case ACCESSIBILITY -> getConfig().getEmployeePortalAccessibilityStatementMarkdown();
            case CONTACT -> getConfig().getContactMarkdown();
            case PRIVACY -> getConfig().getEmployeePortalPrivacyPolicyMarkdown();
            case ACKNOWLEDGEMENTS -> getConfig().getAcknowledgementsMarkdown();
          };
    };
  }

  public CitizenAndEmployeeMarkdownInfo getAccessibilityInfo() {
    return markdownMapper.citizenAndEmployeeMarkdownInfoOf(
        getConfig().getCitizenPortalAccessibilityStatementMarkdown(),
            CitizenPortalMarkdownName.ACCESSIBILITY,
        getConfig().getEmployeePortalAccessibilityStatementMarkdown(),
            EmployeePortalMarkdownName.ACCESSIBILITY);
  }

  public InternationalMarkdownInfo getAcknowledgementsInfo() {
    return markdownMapper.internationalMarkdownInfoOf(
        getConfig().getAcknowledgementsMarkdown(), CitizenPortalMarkdownName.ACKNOWLEDGEMENTS);
  }

  public InternationalMarkdownInfo getContactInfo() {
    return markdownMapper.internationalMarkdownInfoOf(
        getConfig().getContactMarkdown(), EmployeePortalMarkdownName.CONTACT);
  }

  public InternationalMarkdownInfo getImprintInfo() {
    return markdownMapper.internationalMarkdownInfoOf(
        getConfig().getImprintMarkdown(), CitizenPortalMarkdownName.IMPRINT);
  }

  public CitizenAndEmployeeMarkdownInfo getPrivacyInfo() {
    return markdownMapper.citizenAndEmployeeMarkdownInfoOf(
        getConfig().getCitizenPortalPrivacyPolicyMarkdown(),
        CitizenPortalMarkdownName.PRIVACY,
        getConfig().getEmployeePortalPrivacyPolicyMarkdown(),
        EmployeePortalMarkdownName.PRIVACY);
  }

  public void updateAccessibility(
      MultiLangDocument citizenDocumentUpdate, MultiLangDocument employeeDocumentUpdate) {
    update(getConfig().getCitizenPortalAccessibilityStatementMarkdown(), citizenDocumentUpdate);
    update(getConfig().getEmployeePortalAccessibilityStatementMarkdown(), employeeDocumentUpdate);
  }

  public void updateAcknowledgements(MultiLangDocument documentUpdate) {
    update(getConfig().getAcknowledgementsMarkdown(), documentUpdate);
  }

  public void updateEmployeeContact(MultiLangDocument employeeDocumentUpdate) {
    update(getConfig().getContactMarkdown(), employeeDocumentUpdate);
  }

  public void updateCitizenImprint(MultiLangDocument citizenDocumentUpdate) {
    update(getConfig().getImprintMarkdown(), citizenDocumentUpdate);
  }

  public void updatePrivacy(
      MultiLangDocument citizenDocumentUpdate, MultiLangDocument employeeDocumentUpdate) {
    update(getConfig().getCitizenPortalPrivacyPolicyMarkdown(), citizenDocumentUpdate);
    update(getConfig().getEmployeePortalPrivacyPolicyMarkdown(), employeeDocumentUpdate);
  }

  private void update(MultiLangDocument persistedDocument, MultiLangDocument documentUpdate) {
    persistedDocument.updateDe(documentUpdate.getDe());
    persistedDocument.updateEn(documentUpdate.getEn());
  }

  @Override
  protected DepartmentConfiguration getInitialConfiguration() throws Exception {
    DepartmentConfiguration departmentConfiguration = new DepartmentConfiguration();
    departmentConfiguration.setLogo(mapToDocument(initialDepartmentConfiguration.logo()));
    departmentConfiguration.setStreetDirectory(
        mapToDocument(initialDepartmentConfiguration.streetDirectory()));
    departmentConfiguration.setMunicipalityDirectory(
        mapToDocument(initialDepartmentConfiguration.municipalityDirectory()));
    departmentConfiguration.setCitizenPortalPrivacyPolicyMarkdown(
        fromResourceDe(initialDepartmentConfiguration.citizenPortalPrivacyPolicyMarkdownDe()));
    departmentConfiguration.setImprintMarkdown(
        fromResourceDe(initialDepartmentConfiguration.imprintMarkdownDe()));
    departmentConfiguration.setCitizenPortalAccessibilityStatementMarkdown(
        fromResourceDe(
            initialDepartmentConfiguration.citizenPortalAccessibilityStatementMarkdownDe()));
    departmentConfiguration.setEmployeePortalPrivacyPolicyMarkdown(
        fromResourceDe(initialDepartmentConfiguration.employeePortalPrivacyPolicyMarkdownDe()));
    departmentConfiguration.setEmployeePortalAccessibilityStatementMarkdown(
        fromResourceDe(
            initialDepartmentConfiguration.employeePortalAccessibilityStatementMarkdownDe()));
    departmentConfiguration.setContactMarkdown(
        fromResourceDe(initialDepartmentConfiguration.contactMarkdownDe()));
    departmentConfiguration.setAcknowledgementsMarkdown(
        fromResourceDe(initialDepartmentConfiguration.acknowledgementsMarkdownDe()));
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

  private MultiLangDocument fromResourceDe(Resource resource) throws IOException {
    MultiLangDocument multiLangDocument = new MultiLangDocument();
    multiLangDocument.updateDe(resource.getContentAsByteArray());
    return multiLangDocument;
  }
}
