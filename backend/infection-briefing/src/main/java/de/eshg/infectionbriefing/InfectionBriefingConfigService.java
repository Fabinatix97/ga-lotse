/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.config.departmentinfo.ConfigAuditLogMapper.getRelevantFieldsForLogging;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.config.i18n.MultiLangFileName;
import de.eshg.config.mapper.MultiLangDocumentMapper;
import de.eshg.file.common.FileValidator;
import de.eshg.infectionbriefing.config.InitialInfectionBriefingConfiguration;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingConfig;
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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InfectionBriefingConfigService
    extends EshgConfigurationService<InfectionBriefingConfig> {

  public static final String LANDING_CONTENT_BASE_FILENAME = "landing_content" + ".md";
  private final InitialInfectionBriefingConfiguration initialConfiguration;
  private final AuditLogWriter auditLogWriter;

  protected InfectionBriefingConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      InitialInfectionBriefingConfiguration initialConfiguration,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, InfectionBriefingConfig.class);
    this.initialConfiguration = initialConfiguration;
    this.auditLogWriter = auditLogWriter;
  }

  @Override
  protected InfectionBriefingConfig getInitialConfiguration() throws IOException {
    InfectionBriefingConfig infectionBriefingConfig = new InfectionBriefingConfig();
    MultiLangDocument landingContent = new MultiLangDocument();
    landingContent.update(
        Language.GERMAN, initialConfiguration.landingContentDe().getContentAsByteArray());
    landingContent.update(
        Language.ENGLISH, initialConfiguration.landingContentEn().getContentAsByteArray());
    infectionBriefingConfig.setLandingContent(landingContent);

    return infectionBriefingConfig;
  }

  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf("INFECTION_BRIEFING", determineConfigurationStatus());
  }

  @Override
  public InfectionBriefingConfig getConfig() {
    return super.getConfig();
  }

  private ConfigurationStatus determineConfigurationStatus() {
    InfectionBriefingConfig config = getConfig();
    if (!(config.isInitialized())) {
      return ConfigurationStatus.INCOMPLETE;
    }

    return MultiLangDocumentMapper.mapToConfigurationStatus(config.getLandingContent());
  }

  MultiLangFileName getMultiLangFileName() {
    return MultiLangFileName.fromFilenameWithLanguageTags(LANDING_CONTENT_BASE_FILENAME);
  }

  InfectionBriefingConfig updateConfig(Map<Language, MultipartFile> landingContent) {
    if (!landingContent.containsKey(Language.GERMAN)) {
      throw new BadRequestException("Landing page content must be given in german language.");
    }
    for (var entry : landingContent.values()) {
      FileValidator.validateMarkdownFile(entry);
    }
    InfectionBriefingConfig currentConfig = getConfig();

    MultiLangDocument updateDocument;
    try {
      updateDocument = MultiLangDocumentMapper.mapToDomain(landingContent);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    auditLogWriter.writeChangeToAuditLog(
        "landingContentConfig",
        getRelevantFieldsForLogging(currentConfig.getLandingContent()),
        getRelevantFieldsForLogging(updateDocument));

    currentConfig.setLandingContent(updateDocument);
    currentConfig.setInitialized(true);
    return currentConfig;
  }

  ResponseEntity<Resource> downloadLandingPage(Language language) {
    if (!getConfig().isInitialized()) {
      throw new NotFoundException("Config is not initialized");
    }
    return MultiLangDocumentHelper.getAsResourceByLanguageOrThrow(
        getConfig().getLandingContent(), getMultiLangFileName(), language, MediaType.TEXT_MARKDOWN);
  }
}
