/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.config;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.officialmedicalservice.config.api.PutOmsConfigRequest;
import de.eshg.officialmedicalservice.config.persistence.entity.OmsConfiguration;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Map;
import java.util.SequencedMap;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Component
public class OmsConfigService extends EshgConfigurationService<OmsConfiguration> {

  public static final String CONFIGURATION_ENDPOINT = "OFFICIAL_MEDICAL_SERVICE";

  public static final String CONCERNS_FILENAME = "concerns.yaml";
  public static final String LANDING_CONTENT_BASE_FILENAME =
      "landing_content.md"; // language suffixes will be injected
  public static final String SELECT_CONCERN_INFOBOX_BASE_FILENAME =
      "select_concern_infobox.md"; // language suffixes will be injected

  private final InitialOmsConfiguration initialOmsConfiguration;
  private final AuditLogWriter auditLogWriter;

  private final MultiLangFileName landingContentFileNames;
  private final MultiLangFileName selectConcernInfoboxFileNames;
  private final String concernsFileName;
  private final OmsConfigValidator omsConfigValidator;

  public OmsConfigService(
      InitialOmsConfiguration initialOmsConfiguration,
      EntityManager entityManager,
      AuditLogWriter auditLogWriter,
      TransactionHelper transactionHelper,
      OmsConfigValidator omsConfigValidator) {
    super(entityManager, transactionHelper, OmsConfiguration.class);
    this.initialOmsConfiguration = initialOmsConfiguration;
    this.auditLogWriter = auditLogWriter;
    this.concernsFileName = CONCERNS_FILENAME;
    this.landingContentFileNames =
        MultiLangFileName.fromFilenameWithLanguageTags(LANDING_CONTENT_BASE_FILENAME);
    this.selectConcernInfoboxFileNames =
        MultiLangFileName.fromFilenameWithLanguageTags(SELECT_CONCERN_INFOBOX_BASE_FILENAME);
    this.omsConfigValidator = omsConfigValidator;
  }

  public String getConcernsFilename() {
    return concernsFileName;
  }

  public MultiLangFileName getLandingContentFileNames() {
    return landingContentFileNames;
  }

  public MultiLangFileName getSelectConcernInfoboxFileNames() {
    return selectConcernInfoboxFileNames;
  }

  public OmsConfiguration getConfig() {
    return super.getConfig();
  }

  @Override
  protected OmsConfiguration getInitialConfiguration() throws Exception {
    OmsConfiguration omsConfiguration = new OmsConfiguration();

    Document concerns = new Document();
    concerns.setContent(initialOmsConfiguration.concerns().getContentAsByteArray());
    omsConfiguration.setConcerns(concerns);

    MultiLangDocument landingContent = new MultiLangDocument();
    landingContent.update(
        Language.GERMAN, initialOmsConfiguration.landingContentDe().getContentAsByteArray());
    landingContent.update(
        Language.ENGLISH, initialOmsConfiguration.landingContentEn().getContentAsByteArray());
    omsConfiguration.setLandingContent(landingContent);

    omsConfiguration.setKeycloakUserCleanupJobOverdueDuration(
        (int) initialOmsConfiguration.keycloakUserCleanupJobOverdueDuration().toDays());
    omsConfiguration.setMedicalOpinionCutOffDateLeadTime(
        initialOmsConfiguration.medicalOpinionCutOffDateLeadTime());
    omsConfiguration.setCitizenPortalAnamnesisEnabled(
        initialOmsConfiguration.citizenPortalAnamnesisEnabled());

    return omsConfiguration;
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    ConfigurationStatus configurationStatus = determineConfigurationStatus();
    return MapUtils.orderedMapOf(CONFIGURATION_ENDPOINT, configurationStatus);
  }

  @Transactional
  public ResponseEntity<Resource> downloadConcerns() {
    return OmsConfigMapper.documentToEntity(
        getConfig().getConcerns(), getConcernsFilename(), MediaType.APPLICATION_YAML);
  }

  @Transactional
  public ResponseEntity<Resource> downloadLandingPage(Language language) {
    if (!getConfig().isInitialized()) {
      throw new NotFoundException("Config is not initialized");
    }
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        getConfig().getLandingContent(),
        getLandingContentFileNames(),
        language,
        MediaType.TEXT_MARKDOWN);
  }

  @Transactional
  public ResponseEntity<Resource> downloadSelectConcernInfobox(Language language) {
    MultiLangDocument selectConcernInfobox = getConfig().getSelectConcernInfobox();
    if (selectConcernInfobox == null) {
      return ResponseEntity.notFound().build();
    }
    return MultiLangDocumentHelper.getAsResponseWithFallback(
        selectConcernInfobox,
        getSelectConcernInfoboxFileNames(),
        language,
        MediaType.TEXT_MARKDOWN);
  }

  @Transactional
  public void updateConfiguration(
      MultipartFile concerns,
      Map<Language, MultipartFile> landingContent,
      Map<Language, MultipartFile> selectConcernInfobox,
      PutOmsConfigRequest configRequest) {
    if (!landingContent.containsKey(Language.GERMAN)) {
      throw new BadRequestException("German landing content is mandatory!");
    }
    if (!selectConcernInfobox.isEmpty() && !selectConcernInfobox.containsKey(Language.GERMAN)) {
      throw new BadRequestException(
          "Select concern infobox: German localization is mandatory if another localization is present");
    }

    try {
      omsConfigValidator.validateConcerns(concerns);
      for (var entry : landingContent.entrySet()) {
        omsConfigValidator.validateContent(entry.getValue(), entry.getKey(), "landing page");
      }
      for (var entry : selectConcernInfobox.entrySet()) {
        omsConfigValidator.validateContent(
            entry.getValue(), entry.getKey(), "Select concern infobox");
      }
    } catch (OmsConfigValidator.OmsConfigValidatorException cve) {
      String jsonInfo =
          "{ \"document\": \""
              + cve.getWhichDocument()
              + "\", \"message\": \""
              + cve.getMessage()
              + "\" }";
      throw new BadRequestException(jsonInfo);
    }

    OmsConfiguration currentConfig = getConfig();

    Document updateConcerns = new Document();
    MultiLangDocument updateLandingPage;
    MultiLangDocument selectConcernInfoboxDoc;
    try {
      updateConcerns.setContent(concerns.getBytes());
      updateLandingPage = MultiLangDocumentMapper.mapToDomain(landingContent);
      selectConcernInfoboxDoc = MultiLangDocumentMapper.mapToDomain(selectConcernInfobox);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }

    Integer updateKeycloakUserCleanupJobOverdueDuration =
        configRequest.keycloakUserCleanupJobOverdueDuration();
    Integer updateMedicalOpinionCutOffDateLeadTime =
        configRequest.medicalOpinionCutOffDateLeadTime();
    Boolean updateCitizenPortalAnamnesisEnabled = configRequest.citizenPortalAnamnesisEnabled();

    IOmsConfiguration updateConfig =
        new OmsConfigurationData(
            updateConcerns,
            updateLandingPage,
            selectConcernInfoboxDoc,
            updateKeycloakUserCleanupJobOverdueDuration,
            updateMedicalOpinionCutOffDateLeadTime,
            updateCitizenPortalAnamnesisEnabled);

    auditLogWriter.writeChangeToAuditLog(
        "omsConfiguration",
        OmsConfigAuditLogMapper.getRelevantFieldsForLogging(currentConfig),
        OmsConfigAuditLogMapper.getRelevantFieldsForLogging(updateConfig));

    currentConfig.setConcerns(updateConcerns);
    currentConfig.setLandingContent(updateLandingPage);
    currentConfig.setSelectConcernInfobox(selectConcernInfoboxDoc);
    currentConfig.setKeycloakUserCleanupJobOverdueDuration(
        configRequest.keycloakUserCleanupJobOverdueDuration());
    currentConfig.setMedicalOpinionCutOffDateLeadTime(
        configRequest.medicalOpinionCutOffDateLeadTime());
    currentConfig.setCitizenPortalAnamnesisEnabled(configRequest.citizenPortalAnamnesisEnabled());
    currentConfig.setInitialized(true);
  }

  private ConfigurationStatus determineConfigurationStatus() {
    OmsConfiguration config = getConfig();
    if (!(config.isInitialized())) {
      return ConfigurationStatus.INCOMPLETE;
    }

    // verify that all document localizations are complete
    return MultiLangDocumentMapper.mapToConfigurationStatus(
        config.getLandingContent(), config.getSelectConcernInfobox());
  }
}
