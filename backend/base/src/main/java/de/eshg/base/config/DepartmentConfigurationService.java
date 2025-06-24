/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.config.departmentinfo.ConfigAuditLogMapper.getRelevantFieldsForLogging;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.base.department.CitizenPortalMarkdownName;
import de.eshg.base.department.EmployeePortalMarkdownName;
import de.eshg.base.department.MarkdownName;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.svgsanitizer.SvgSanitizerApi;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.SequencedMap;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

@Component
public class DepartmentConfigurationService
    extends EshgConfigurationService<DepartmentConfiguration> {

  public static final String ACCESSIBILITY_STATEMENT_MARKDOWNS_ENDPOINT =
      "ACCESSIBILITY_STATEMENT_MARKDOWNS_CONFIG";
  public static final String ACKNOWLEDGEMENTS_MARKDOWNS_ENDPOINT =
      "ACKNOWLEDGEMENTS_MARKDOWNS_CONFIG";
  public static final String CONTACT_MARKDOWNS_ENDPOINT = "CONTACT_MARKDOWNS_CONFIG";
  public static final String IMPRINT_MARKDOWNS_ENDPOINT = "IMPRINT_MARKDOWNS_CONFIG";
  public static final String LOGO_CONFIG_ENDPOINT = "LOGO_CONFIG";
  public static final String PRIVACY_POLICY_MARKDOWNS_ENDPOINT = "PRIVACY_POLICY_MARKDOWNS_CONFIG";

  private final InitialDepartmentConfiguration initialDepartmentConfiguration;
  private final AuditLogWriter auditLogWriter;
  private final AuditLogger auditLogger;
  private final BaseConfigurationProperties baseConfigurationProperties;
  private final SvgValidations svgValidations;

  public DepartmentConfigurationService(
      InitialDepartmentConfiguration initialDepartmentConfiguration,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      EntityManager entityManager,
      AuditLogger auditLogger,
      BaseConfigurationProperties baseConfigurationProperties,
      SvgValidations svgValidations) {
    super(entityManager, transactionHelper, DepartmentConfiguration.class);
    this.initialDepartmentConfiguration = initialDepartmentConfiguration;
    this.auditLogWriter = auditLogWriter;
    this.auditLogger = auditLogger;
    this.baseConfigurationProperties = baseConfigurationProperties;
    this.svgValidations = svgValidations;
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

  public void updateStreetAndMunicipalityDirectory(
      Document streetDirectory, Document municipalityDirectory) {
    DepartmentConfiguration config = getConfig();
    auditLogWriter.writeChangeToAuditLog(
        "departmentConfiguration",
        getRelevantFieldsForLogging(config.getStreetDirectory(), config.getMunicipalityDirectory()),
        getRelevantFieldsForLogging(streetDirectory, municipalityDirectory));
    config.setStreetDirectory(streetDirectory);
    config.setMunicipalityDirectory(municipalityDirectory);
    config.setStreetAndMunicipalityDirectoriesInitialized(true);
  }

  public MultiLangDocument getMarkdown(MarkdownName markdownName) {
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

  public void updateLogoSvg(Resource logoSvg) throws IOException {
    String sanitizedSvg =
        SvgSanitizerApi.createClient(baseConfigurationProperties.svgSanitizerBaseUrl())
            .sanitize(new String(logoSvg.getContentAsByteArray(), StandardCharsets.UTF_8));

    byte[] sanitizedSvgBytes = sanitizedSvg.getBytes(StandardCharsets.UTF_8);
    svgValidations.validateSvg(sanitizedSvgBytes);
    svgValidations.validateThatPdfGenerationIsPossible(sanitizedSvgBytes);

    DepartmentConfiguration departmentConfiguration = getConfig();
    String oldLogoMd5 = DigestUtils.md5DigestAsHex(departmentConfiguration.getLogo().getContent());
    departmentConfiguration.setLogo(mapToDocument(sanitizedSvgBytes));
    departmentConfiguration.setLogoInitialized(true);

    String newLogoMd5 = DigestUtils.md5DigestAsHex(sanitizedSvgBytes);

    auditLogger.log(
        "Konfiguration",
        "Änderung der Logo SVG Datei",
        Map.of(
            "User ID",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "MD5 alt",
            oldLogoMd5,
            "MD5 neu",
            newLogoMd5));
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
    auditLogWriter.writeChangeToAuditLog(
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
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    DepartmentConfiguration config = getConfig();
    return MapUtils.orderedMapOfEntries(
        getAccessibilityStatementConfigurationStatus(config),
        getAcknowledgementsConfigurationStatus(config),
        getContactConfigurationStatus(config),
        getImprintConfigurationStatus(config),
        getLogoConfigurationStatus(config),
        getPrivacyPolicyConfigurationStatus(config));
  }

  @VisibleForTesting
  public void setNotInitialized() {
    getConfig().setAccessibilityStatementMarkdownsInitialized(false);
    getConfig().setAcknowledgementsMarkdownsInitialized(false);
    getConfig().setContactMarkdownsInitialized(false);
    getConfig().setImprintMarkdownsInitialized(false);
    getConfig().setPrivacyPolicyMarkdownsInitialized(false);
    getConfig().setLogoInitialized(false);
    getConfig().setStreetAndMunicipalityDirectoriesInitialized(false);
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

  private Map.Entry<String, ConfigurationStatus> getLogoConfigurationStatus(
      DepartmentConfiguration config) {
    return Map.entry(
        LOGO_CONFIG_ENDPOINT,
        config.isLogoInitialized() ? ConfigurationStatus.COMPLETE : ConfigurationStatus.INCOMPLETE);
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
    return mapToDocument(resource.getContentAsByteArray());
  }

  private static Document mapToDocument(byte[] bytes) {
    Document document = new Document();
    document.setContent(bytes);
    return document;
  }

  private MultiLangDocument fromResourceDe(Resource resource) throws IOException {
    MultiLangDocument multiLangDocument = new MultiLangDocument();
    multiLangDocument.updateDe(resource.getContentAsByteArray());
    return multiLangDocument;
  }
}
