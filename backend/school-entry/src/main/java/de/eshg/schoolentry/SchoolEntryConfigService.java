/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.config.ConfigurationEndpoint.SCHOOL_ENTRY;
import static de.eshg.schoolentry.mapper.SchoolEntryConfigAuditLogMapper.getRelevantFieldsForLogging;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.base.SalutationDto;
import de.eshg.base.user.api.UserProfileDto;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.DocumentTypes;
import de.eshg.schoolentry.api.configuration.SchoolEntryConfigDto;
import de.eshg.schoolentry.api.pdf.EmployeeInfoDto;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryConfig;
import jakarta.persistence.EntityManager;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.SequencedMap;
import java.util.Set;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryConfigService extends EshgConfigurationService<SchoolEntryConfig> {

  protected SchoolEntryConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AppointmentBlockProperties appointmentBlockProperties,
      SchoolEntryProperties schoolEntryProperties,
      AppointmentBlockRepository appointmentBlockRepository,
      SchoolEntryConfigRepository schoolEntryConfigRepository,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, SchoolEntryConfig.class);
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.schoolEntryProperties = schoolEntryProperties;
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.schoolEntryConfigRepository = schoolEntryConfigRepository;
    this.auditLogWriter = auditLogWriter;
  }

  private final AppointmentBlockProperties appointmentBlockProperties;
  private final SchoolEntryProperties schoolEntryProperties;
  private final AppointmentBlockRepository appointmentBlockRepository;
  private final SchoolEntryConfigRepository schoolEntryConfigRepository;
  private final AuditLogWriter auditLogWriter;

  @Override
  protected SchoolEntryConfig getInitialConfiguration() {
    SchoolEntryConfig schoolEntryConfiguration = new SchoolEntryConfig();
    schoolEntryConfiguration.setLocationSelectionMode(
        appointmentBlockProperties.getLocationSelectionMode());
    schoolEntryConfiguration.setDirectProcedureTypeAssignmentOnImport(
        schoolEntryProperties.isDirectProcedureTypeAssignmentOnImport());
    schoolEntryConfiguration.setPdfDocumentAccentColor(
        schoolEntryProperties.getPdfDocumentAccentColor());
    schoolEntryConfiguration.setDocumentsWithEmployeeInfo(new LinkedHashSet<>());
    schoolEntryConfiguration.setInvitationIncludePerson(false);
    schoolEntryConfiguration.setInvitationIncludeRoom(false);
    return schoolEntryConfiguration;
  }

  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(SCHOOL_ENTRY.name(), mapToConfigurationStatus(getConfig()));
  }

  public SchoolEntryConfigDto getConfiguration() {
    SchoolEntryConfig config = getConfig();
    if (config.isInitialized()) {
      return new SchoolEntryConfigDto(
          config.getLocationSelectionMode(),
          isLocationSelectionModeReadOnly(),
          config.isDirectProcedureTypeAssignmentOnImport(),
          config.getPdfDocumentAccentColor(),
          schoolEntryConfigRepository.findDocumentTypesByConfigId(config.getId()),
          config.isInvitationIncludePerson(),
          config.isInvitationIncludeRoom());
    } else {
      return null;
    }
  }

  public @Nullable EmployeeInfoDto getEmployeeInfoIfAllowed(
      UserProfileDto userProfile, DocumentTypes documentType) {
    if (getDocumentsWithEmployeeInfo().contains(documentType)) {
      return new EmployeeInfoDto(
          userProfile.user().firstName(),
          userProfile.user().lastName(),
          userProfile.user().email(),
          userProfile.user().phoneNumber(),
          getSalutation(userProfile.salutation()),
          userProfile.title());
    } else {
      return null;
    }
  }

  private String getSalutation(SalutationDto salutation) {
    if (salutation == null) {
      return "";
    }
    return switch (salutation) {
      case MALE -> "Hr.";
      case FEMALE -> "Fr.";
      default -> "";
    };
  }

  public LocationSelectionMode getLocationSelectionMode() {
    return getConfig().getLocationSelectionMode();
  }

  public boolean isDirectProcedureTypeAssignmentOnImport() {
    return getConfig().isDirectProcedureTypeAssignmentOnImport();
  }

  public String getPdfDocumentAccentColor() {
    return getConfig().getPdfDocumentAccentColor();
  }

  public Set<DocumentTypes> getDocumentsWithEmployeeInfo() {
    return getConfig().getDocumentsWithEmployeeInfo();
  }

  public boolean isInvitationIncludePerson() {
    return getConfig().isInvitationIncludePerson();
  }

  public boolean isInvitationIncludeRoom() {
    return getConfig().isInvitationIncludeRoom();
  }

  public void update(SchoolEntryConfig configUpdate) {
    SchoolEntryConfig persistentConfig = getConfig();
    auditLogWriter.writeChangeToAuditLog(
        "schoolEntryConfig",
        getRelevantFieldsForLogging(persistentConfig),
        getRelevantFieldsForLogging(configUpdate));
    updateLocationSelectionMode(persistentConfig, configUpdate.getLocationSelectionMode());
    updateDirectProcedureTypeAssignmentOnImport(
        persistentConfig, configUpdate.isDirectProcedureTypeAssignmentOnImport());
    updatePdfDocumentAccentColor(persistentConfig, configUpdate.getPdfDocumentAccentColor());
    updateDocumentsWithEmployeeInfo(persistentConfig, configUpdate.getDocumentsWithEmployeeInfo());
    updateInvitationIncludePerson(persistentConfig, configUpdate.isInvitationIncludePerson());
    updateInvitationIncludeRoom(persistentConfig, configUpdate.isInvitationIncludeRoom());
  }

  @VisibleForTesting
  public void updateLocationSelectionMode(LocationSelectionMode locationSelectionMode) {
    updateLocationSelectionMode(getConfig(), locationSelectionMode);
  }

  private void updateLocationSelectionMode(
      SchoolEntryConfig persistentConfig, LocationSelectionMode locationSelectionMode) {
    if (locationSelectionMode != persistentConfig.getLocationSelectionMode()
        && isLocationSelectionModeReadOnly()) {
      throw new BadRequestException("LocationSelectionMode is read only");
    }
    persistentConfig.setInitialized(true);
    persistentConfig.setLocationSelectionMode(locationSelectionMode);
  }

  @VisibleForTesting
  public void updateDirectProcedureTypeAssignmentOnImport(
      boolean directProcedureTypeAssignmentOnImport) {
    updateDirectProcedureTypeAssignmentOnImport(getConfig(), directProcedureTypeAssignmentOnImport);
  }

  @VisibleForTesting
  public void updateDocumentsWithEmployeeInfo(List<DocumentTypes> documentsToIncludeEmployeeInfo) {
    updateDocumentsWithEmployeeInfo(
        getConfig(), new LinkedHashSet<>(documentsToIncludeEmployeeInfo));
  }

  private void updateDirectProcedureTypeAssignmentOnImport(
      SchoolEntryConfig persistentConfig, boolean directProcedureTypeAssignmentOnImport) {
    persistentConfig.setInitialized(true);
    persistentConfig.setDirectProcedureTypeAssignmentOnImport(
        directProcedureTypeAssignmentOnImport);
  }

  private void updatePdfDocumentAccentColor(
      SchoolEntryConfig persistentConfig, String pdfDocumentAccentColor) {
    persistentConfig.setInitialized(true);
    persistentConfig.setPdfDocumentAccentColor(pdfDocumentAccentColor);
  }

  private void updateDocumentsWithEmployeeInfo(
      SchoolEntryConfig persistentConfig, Set<DocumentTypes> documentsToIncludeEmployeeInfo) {
    persistentConfig.setInitialized(true);
    persistentConfig.setDocumentsWithEmployeeInfo(documentsToIncludeEmployeeInfo);
  }

  private void updateInvitationIncludePerson(
      SchoolEntryConfig persistentConfig, boolean invitationIncludePerson) {
    persistentConfig.setInitialized(true);
    persistentConfig.setInvitationIncludePerson(invitationIncludePerson);
  }

  private void updateInvitationIncludeRoom(
      SchoolEntryConfig persistentConfig, boolean invitationIncludeRoom) {
    persistentConfig.setInitialized(true);
    persistentConfig.setInvitationIncludeRoom(invitationIncludeRoom);
  }

  private ConfigurationStatus mapToConfigurationStatus(SchoolEntryConfig config) {
    return config.isInitialized() ? ConfigurationStatus.COMPLETE : ConfigurationStatus.INCOMPLETE;
  }

  private boolean isLocationSelectionModeReadOnly() {
    return appointmentBlockRepository.count() > 0;
  }
}
