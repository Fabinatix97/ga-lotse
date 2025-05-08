/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.config.ConfigurationEndpoint.SCHOOL_ENTRY;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.configuration.SchoolEntryConfigDto;
import de.eshg.schoolentry.api.configuration.UpdateSchoolEntryConfigRequest;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.SchoolEntryConfig;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
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
      ProcedureRepository<SchoolEntryProcedure> procedureRepository,
      AppointmentBlockRepository appointmentBlockRepository) {
    super(entityManager, transactionHelper, SchoolEntryConfig.class);
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.schoolEntryProperties = schoolEntryProperties;
    this.procedureRepository = procedureRepository;
    this.appointmentBlockRepository = appointmentBlockRepository;
  }

  private final AppointmentBlockProperties appointmentBlockProperties;
  private final SchoolEntryProperties schoolEntryProperties;
  private final ProcedureRepository<SchoolEntryProcedure> procedureRepository;
  private final AppointmentBlockRepository appointmentBlockRepository;

  @Override
  protected SchoolEntryConfig getInitialConfiguration() {
    SchoolEntryConfig schoolEntryConfiguration = new SchoolEntryConfig();
    schoolEntryConfiguration.setLocationSelectionMode(
        appointmentBlockProperties.getLocationSelectionMode());
    schoolEntryConfiguration.setDirectProcedureTypeAssignmentOnImport(
        schoolEntryProperties.isDirectProcedureTypeAssignmentOnImport());
    schoolEntryConfiguration.setPdfDocumentAccentColor(
        schoolEntryProperties.getPdfDocumentAccentColor());
    return schoolEntryConfiguration;
  }

  @Override
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(SCHOOL_ENTRY.name(), mapToConfigurationStatus(getConfig()));
  }

  public SchoolEntryConfigDto getConfiguration() {
    SchoolEntryConfig config = getConfig();
    if (config.isInitialized()) {
      return new SchoolEntryConfigDto(
          config.getLocationSelectionMode(),
          isLocationSelectionModeReadOnly(),
          config.isDirectProcedureTypeAssignmentOnImport(),
          isDirectProcedureTypeAssignmentOnImportReadOnly(),
          config.getPdfDocumentAccentColor());
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

  public void update(UpdateSchoolEntryConfigRequest request) {
    SchoolEntryConfig persistentConfig = getConfig();
    updateLocationSelectionMode(persistentConfig, request.locationSelectionMode());
    updateDirectProcedureTypeAssignmentOnImport(
        persistentConfig, request.directProcedureTypeAssignmentOnImport());
    updatePdfDocumentAccentColor(persistentConfig, request.pdfDocumentAccentColor());
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
    if (directProcedureTypeAssignmentOnImport
            != persistentConfig.isDirectProcedureTypeAssignmentOnImport()
        && isDirectProcedureTypeAssignmentOnImportReadOnly()) {
      throw new BadRequestException("DirectProcedureTypeAssignmentOnImport is read only");
    }
    persistentConfig.setInitialized(true);
    persistentConfig.setDirectProcedureTypeAssignmentOnImport(
        directProcedureTypeAssignmentOnImport);
  }

  private void updatePdfDocumentAccentColor(
      SchoolEntryConfig persistentConfig, String pdfDocumentAccentColor) {
    persistentConfig.setInitialized(true);
    persistentConfig.setPdfDocumentAccentColor(pdfDocumentAccentColor);
  }

  @VisibleForTesting
  void setNotInitialized() {
    getConfig().setInitialized(false);
  }

  private ConfigurationStatus mapToConfigurationStatus(SchoolEntryConfig config) {
    return config.isInitialized() ? ConfigurationStatus.COMPLETE : ConfigurationStatus.INCOMPLETE;
  }

  private boolean isDirectProcedureTypeAssignmentOnImportReadOnly() {
    return procedureRepository.count() > 0;
  }

  private boolean isLocationSelectionModeReadOnly() {
    return appointmentBlockRepository.count() > 0;
  }
}
