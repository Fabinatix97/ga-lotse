/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.EntityManager;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.io.UncheckedIOException;
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

  private final InitialOmsConfiguration initialOmsConfiguration;
  private final AuditLogWriter auditLogWriter;

  private final MultiLangFileName landingContentFileNames;
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
    this.omsConfigValidator = omsConfigValidator;
  }

  public String getConcernsFilename() {
    return concernsFileName;
  }

  public MultiLangFileName getLandingContentFileNames() {
    return landingContentFileNames;
  }

  public String getLandingContentFileName(Language language) {
    return switch (language) {
      case GERMAN -> landingContentFileNames.de();
      case ENGLISH -> landingContentFileNames.en();
    };
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
    landingContent.updateDe(initialOmsConfiguration.landingContentDe().getContentAsByteArray());
    landingContent.updateEn(initialOmsConfiguration.landingContentEn().getContentAsByteArray());
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
    return MultiLangDocumentHelper.getAsResponseWithFallback(
        getConfig().getLandingContent(),
        getLandingContentFileNames(),
        language,
        MediaType.TEXT_MARKDOWN);
  }

  @Transactional
  public void updateConfiguration(
      MultipartFile concerns,
      MultipartFile landingContentDe,
      MultipartFile landingContentEn,
      PutOmsConfigRequest configRequest) {
    boolean landingPageEnDeletionRequested =
        Boolean.TRUE.equals(configRequest.deleteLandingPageEn());
    if (landingPageEnDeletionRequested && landingContentEn != null) {
      throw new BadRequestException(
          "Landing page EN: can't combine a deletion request and new content");
    }

    try {
      omsConfigValidator.validateConcerns(concerns);
      omsConfigValidator.validateLandingContent(landingContentDe, Language.GERMAN);
      omsConfigValidator.validateLandingContent(landingContentEn, Language.ENGLISH);
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

    Document updateConcerns = determineUpdateConcerns(concerns, currentConfig);
    MultiLangDocument updateLandingPage =
        determineUpdateLandingPage(
            currentConfig, landingContentDe, landingContentEn, landingPageEnDeletionRequested);

    Integer updateKeycloakUserCleanupJobOverdueDuration =
        configRequest.keycloakUserCleanupJobOverdueDuration();
    Integer updateMedicalOpinionCutOffDateLeadTime =
        configRequest.medicalOpinionCutOffDateLeadTime();
    Boolean updateCitizenPortalAnamnesisEnabled = configRequest.citizenPortalAnamnesisEnabled();

    IOmsConfiguration updateConfig =
        new OmsConfigurationData(
            updateConcerns,
            updateLandingPage,
            updateKeycloakUserCleanupJobOverdueDuration,
            updateMedicalOpinionCutOffDateLeadTime,
            updateCitizenPortalAnamnesisEnabled);

    auditLogWriter.writeChangeToAuditLog(
        "omsConfiguration",
        OmsConfigAuditLogMapper.getRelevantFieldsForLogging(currentConfig),
        OmsConfigAuditLogMapper.getRelevantFieldsForLogging(updateConfig));

    currentConfig.setConcerns(updateConcerns);
    currentConfig.setLandingContent(updateLandingPage);
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

    // it's the landing content which actually determines the configuration status
    MultiLangDocument landingContent = config.getLandingContent();
    return MultiLangDocumentMapper.mapToConfigurationStatus(landingContent);
  }

  private static Document determineUpdateConcerns(
      MultipartFile concerns, OmsConfiguration currentConfig) {
    Document updateConcerns;

    if (concerns != null) {
      updateConcerns = mapToDomain(concerns);
    } else {
      Document currentConcernsContent = currentConfig.getConcerns();
      updateConcerns = cloneDocument(currentConcernsContent);
    }
    return updateConcerns;
  }

  private static MultiLangDocument determineUpdateLandingPage(
      OmsConfiguration currentConfig,
      MultipartFile landingContentDe,
      MultipartFile landingContentEn,
      boolean landingPageEnDeletionRequested) {
    MultiLangDocument updateLandingPage = cloneMultiLangDocument(currentConfig.getLandingContent());
    if (landingContentDe != null)
      updateLandingPage.updateDe(getLandingContentBytes(landingContentDe));
    if (landingContentEn != null)
      updateLandingPage.updateEn(getLandingContentBytes(landingContentEn));

    if (landingPageEnDeletionRequested) updateLandingPage.updateEn((byte[]) null);

    return updateLandingPage;
  }

  private static byte[] getLandingContentBytes(MultipartFile landingContentDe) {
    try {
      return landingContentDe.getBytes();
    } catch (IOException ioe) {
      throw new UncheckedIOException(ioe);
    }
  }

  private static Document mapToDomain(MultipartFile file) {
    Document document = new Document();
    document.setContent(getLandingContentBytes(file));
    return document;
  }

  private static MultiLangDocument cloneMultiLangDocument(
      @NotNull MultiLangDocument multiLangDocument) {

    MultiLangDocument cloned = new MultiLangDocument();

    Document de = multiLangDocument.getDe();
    Document en = multiLangDocument.getEn();

    if (de != null) {
      cloned.updateDe(de);
    }
    if (en != null) {
      cloned.updateEn(en);
    }

    return cloned;
  }

  private static Document cloneDocument(@NotNull Document document) {
    Document cloned = new Document();
    cloned.setContent(document.getContent());

    return cloned;
  }
}
