/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.config.ConfigurationEndpoint.SCHOOL_ENTRY;
import static de.eshg.schoolentry.mapper.SchoolEntryConfigAuditLogMapper.getRelevantFieldsForLogging;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.lib.appointmentblock.api.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.configuration.SchoolEntryConfigDto;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryConfig;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryConfigService extends EshgConfigurationService<SchoolEntryConfig> {

  protected SchoolEntryConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AppointmentBlockProperties appointmentBlockProperties,
      SchoolEntryProperties schoolEntryProperties,
      AppointmentBlockRepository appointmentBlockRepository,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, SchoolEntryConfig.class);
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.schoolEntryProperties = schoolEntryProperties;
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.auditLogWriter = auditLogWriter;
  }

  private final AppointmentBlockProperties appointmentBlockProperties;
  private final SchoolEntryProperties schoolEntryProperties;
  private final AppointmentBlockRepository appointmentBlockRepository;
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
          config.isInvitationIncludePerson(),
          config.isInvitationIncludeRoom());
    } else {
      return null;
    }
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
