/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.base.config.MarkdownMapper.mapToAccessibilityInfo;
import static de.eshg.base.config.MarkdownMapper.mapToAcknowledgementInfo;
import static de.eshg.base.config.MarkdownMapper.mapToContactInfo;
import static de.eshg.base.config.MarkdownMapper.mapToImprintInfo;
import static de.eshg.base.config.MarkdownMapper.mapToPrivacyInfo;
import static de.eshg.config.departmentinfo.ConfigAuditLogMapper.getRelevantFieldsForLogging;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.base.config.api.CitizenAndEmployeeMarkdownInfo;
import de.eshg.base.config.api.InternationalMarkdownInfo;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.base.department.MarkdownName;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.SequencedMap;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class DepartmentConfigurationService
    extends EshgConfigurationService<DepartmentConfiguration> {

  private static final String CONFIGURATION_ENDPOINT = "DEPARTMENT_CONFIG";
  public static final String ACCESSIBILITY_STATEMENT_MARKDOWNS_ENDPOINT =
      "ACCESSIBILITY_STATEMENT_MARKDOWNS_CONFIG";
  public static final String ACKNOWLEDGEMENTS_MARKDOWNS_ENDPOINT =
      "ACKNOWLEDGEMENTS_MARKDOWNS_CONFIG";
  public static final String CONTACT_MARKDOWNS_ENDPOINT = "CONTACT_MARKDOWNS_CONFIG";
  public static final String IMPRINT_MARKDOWNS_ENDPOINT = "IMPRINT_MARKDOWNS_CONFIG";
  public static final String PRIVACY_POLICY_MARKDOWNS_ENDPOINT = "PRIVACY_POLICY_MARKDOWNS_CONFIG";

  private final InitialDepartmentConfiguration initialDepartmentConfiguration;
  private final AuditLogWriter auditLogWriter;

  public DepartmentConfigurationService(
      InitialDepartmentConfiguration initialDepartmentConfiguration,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      EntityManager entityManager) {
    super(entityManager, transactionHelper, DepartmentConfiguration.class);
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
    this.auditLogWriter = auditLogWriter;
  }

  @Override
  public DepartmentConfiguration getConfig() {
    return super.getConfig();
  }

  public byte[] getLogo() {
    return getConfig().getLogo().getContent();
  }

  public byte[] getStreetDirectory() {
    return getConfig().getStreetDirectory().getContent();
  }

  public byte[] getMunicipalityDirectory() {
    return getConfig().getMunicipalityDirectory().getContent();
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
    return mapToAccessibilityInfo(getConfig());
  }

  public InternationalMarkdownInfo getAcknowledgementsInfo() {
    return mapToAcknowledgementInfo(getConfig());
  }

  public InternationalMarkdownInfo getContactInfo() {
    return mapToContactInfo(getConfig());
  }

  public InternationalMarkdownInfo getImprintInfo() {
    return mapToImprintInfo(getConfig());
  }

  public CitizenAndEmployeeMarkdownInfo getPrivacyInfo() {
    return mapToPrivacyInfo(getConfig());
  }

  public void updateAccessibility(
      MultiLangDocument citizenDocumentUpdate, MultiLangDocument employeeDocumentUpdate) {
    DepartmentConfiguration config = getConfig();
    config.setAccessibilityStatementMarkdownsInitialized(true);
    update(
        config.getCitizenPortalAccessibilityStatementMarkdown(),
        citizenDocumentUpdate,
        "citizenPortalAccessibility");
    update(
        config.getEmployeePortalAccessibilityStatementMarkdown(),
        employeeDocumentUpdate,
        "employeePortalAccessibility");
  }

  public void updateAcknowledgements(MultiLangDocument documentUpdate) {
    DepartmentConfiguration config = getConfig();
    config.setAcknowledgementsMarkdownsInitialized(true);
    update(config.getAcknowledgementsMarkdown(), documentUpdate, "acknowledgements");
  }

  public void updateEmployeeContact(MultiLangDocument employeeDocumentUpdate) {
    DepartmentConfiguration config = getConfig();
    config.setContactMarkdownsInitialized(true);
    update(config.getContactMarkdown(), employeeDocumentUpdate, "contact");
  }

  public void updateCitizenImprint(MultiLangDocument citizenDocumentUpdate) {
    DepartmentConfiguration config = getConfig();
    config.setImprintMarkdownsInitialized(true);
    update(config.getImprintMarkdown(), citizenDocumentUpdate, "imprint");
  }

  public void updatePrivacy(
      MultiLangDocument citizenDocumentUpdate, MultiLangDocument employeeDocumentUpdate) {
    DepartmentConfiguration config = getConfig();
    config.setPrivacyPolicyMarkdownsInitialized(true);
    update(
        config.getCitizenPortalPrivacyPolicyMarkdown(),
        citizenDocumentUpdate,
        "citizenPortalPrivacy");
    update(
        config.getEmployeePortalPrivacyPolicyMarkdown(),
        employeeDocumentUpdate,
        "employeePortalPrivacy");
  }

  private void update(
      MultiLangDocument persistedDocument, MultiLangDocument documentUpdate, String loggingPrefix) {
    auditLogWriter.writeChangeToAuditlog(
        "departmentConfiguration." + loggingPrefix,
        getRelevantFieldsForLogging(persistedDocument),
        getRelevantFieldsForLogging(documentUpdate));
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
    DepartmentConfiguration config = getConfig();
    return MapUtils.orderedMapOfEntries(
        Map.entry(CONFIGURATION_ENDPOINT, ConfigurationStatus.COMPLETE),
        getAccessibilityStatementConfigurationStatus(config),
        getAcknowledgementsConfigurationStatus(config),
        getContactConfigurationStatus(config),
        getImprintConfigurationStatus(config),
        getPrivacyPolicyConfigurationStatus(config));
  }

  @VisibleForTesting
  void setNotInitialized() {
    getConfig().setAccessibilityStatementMarkdownsInitialized(false);
    getConfig().setAcknowledgementsMarkdownsInitialized(false);
    getConfig().setContactMarkdownsInitialized(false);
    getConfig().setImprintMarkdownsInitialized(false);
    getConfig().setPrivacyPolicyMarkdownsInitialized(false);
  }

  private Map.Entry<String, ConfigurationStatus> getAccessibilityStatementConfigurationStatus(
      DepartmentConfiguration config) {
    return Map.entry(
        ACCESSIBILITY_STATEMENT_MARKDOWNS_ENDPOINT,
        getConfigurationStatusOf(
            config.isAccessibilityStatementMarkdownsInitialized(),
            config.getCitizenPortalAccessibilityStatementMarkdown(),
            config.getEmployeePortalAccessibilityStatementMarkdown()));
  }

  private Map.Entry<String, ConfigurationStatus> getAcknowledgementsConfigurationStatus(
      DepartmentConfiguration config) {
    return Map.entry(
        ACKNOWLEDGEMENTS_MARKDOWNS_ENDPOINT,
        getConfigurationStatusOf(
            config.isAcknowledgementsMarkdownsInitialized(), config.getAcknowledgementsMarkdown()));
  }

  private Map.Entry<String, ConfigurationStatus> getContactConfigurationStatus(
      DepartmentConfiguration config) {
    return Map.entry(
        CONTACT_MARKDOWNS_ENDPOINT,
        getConfigurationStatusOf(
            config.isContactMarkdownsInitialized(), config.getContactMarkdown()));
  }

  private Map.Entry<String, ConfigurationStatus> getImprintConfigurationStatus(
      DepartmentConfiguration config) {
    return Map.entry(
        IMPRINT_MARKDOWNS_ENDPOINT,
        getConfigurationStatusOf(
            config.isImprintMarkdownsInitialized(), config.getImprintMarkdown()));
  }

  private Map.Entry<String, ConfigurationStatus> getPrivacyPolicyConfigurationStatus(
      DepartmentConfiguration config) {
    return Map.entry(
        PRIVACY_POLICY_MARKDOWNS_ENDPOINT,
        getConfigurationStatusOf(
            config.isPrivacyPolicyMarkdownsInitialized(),
            config.getCitizenPortalPrivacyPolicyMarkdown(),
            config.getEmployeePortalPrivacyPolicyMarkdown()));
  }

  private ConfigurationStatus getConfigurationStatusOf(
      boolean initialized, MultiLangDocument... multiLangDocuments) {
    if (!initialized) {
      return ConfigurationStatus.INCOMPLETE;
    }
    boolean hasEmptyEnglishDocuments =
        Arrays.stream(multiLangDocuments).map(MultiLangDocument::getEn).anyMatch(Objects::isNull);
    if (hasEmptyEnglishDocuments) {
      return ConfigurationStatus.PARTIALLY_COMPLETE;
    } else {
      return ConfigurationStatus.COMPLETE;
    }
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
