/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.mapper.MeasuringDeviceMapper.mapGdtDriverToDomain;
import static de.eshg.schoolentry.mapper.MeasuringDeviceMapper.mapMeasuringDeviceToDto;
import static de.eshg.schoolentry.mapper.MeasuringDeviceMapper.mapMeasuringDeviceTypeToDomain;
import static de.eshg.schoolentry.mapper.SchoolEntryConfigAuditLogMapper.getRelevantDeviceFieldsForLogging;
import static de.eshg.schoolentry.mapper.SchoolEntryConfigAuditLogMapper.getRelevantDeviceFieldsForLoggingOfRequest;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationEndpoint;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.schoolentry.api.configuration.SchoolEntryDeviceRegistryConfigDto;
import de.eshg.schoolentry.api.configuration.UpdateSchoolEntryMeasurementDeviceRequest;
import de.eshg.schoolentry.domain.model.MeasuringDevice;
import de.eshg.schoolentry.domain.model.SchoolEntryDeviceRegistryConfig;
import de.eshg.schoolentry.domain.repository.MeasuringDeviceRepository;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryDeviceRegistryConfigService
    extends EshgConfigurationService<SchoolEntryDeviceRegistryConfig> {

  protected SchoolEntryDeviceRegistryConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      MeasuringDeviceRepository deviceRepository,
      AuditLogWriter auditLogWriter) {
    super(entityManager, transactionHelper, SchoolEntryDeviceRegistryConfig.class);
    this.deviceRepository = deviceRepository;
    this.auditLogWriter = auditLogWriter;
  }

  private final MeasuringDeviceRepository deviceRepository;
  private final AuditLogWriter auditLogWriter;

  @Override
  protected SchoolEntryDeviceRegistryConfig getInitialConfiguration() {
    return new SchoolEntryDeviceRegistryConfig();
  }

  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        ConfigurationEndpoint.DEVICE_REGISTRY.name(), ConfigurationStatus.COMPLETE);
  }

  public SchoolEntryDeviceRegistryConfigDto getConfiguration() {
    SchoolEntryDeviceRegistryConfig config = getConfig();
    return new SchoolEntryDeviceRegistryConfigDto(
        mapMeasuringDeviceToDto(config.getMeasuringDevices()));
  }

  public void addMeasurementDevice(MeasuringDevice measuringDevice) {
    deviceRepository.save(measuringDevice);
    SchoolEntryDeviceRegistryConfig config = getConfig();
    config.addMeasuringDevice(measuringDevice);

    auditLogWriter.writeChangeToAuditLog(
        "schoolEntryDeviceRegistryConfiguration",
        getRelevantDeviceFieldsForLogging(null),
        getRelevantDeviceFieldsForLogging(measuringDevice));
  }

  public MeasuringDevice updateMeasurementDevice(
      MeasuringDevice measuringDevice, UpdateSchoolEntryMeasurementDeviceRequest request) {
    auditLogWriter.writeChangeToAuditLog(
        "schoolEntryDeviceRegistryConfiguration",
        getRelevantDeviceFieldsForLogging(measuringDevice),
        getRelevantDeviceFieldsForLoggingOfRequest(request));

    measuringDevice.setMeasuringDeviceType(mapMeasuringDeviceTypeToDomain(request.deviceType()));
    measuringDevice.setName(request.name());
    measuringDevice.setEquipmentSelector(request.equipmentSelector());
    measuringDevice.setDriver(mapGdtDriverToDomain(request.gdtDriver()));

    return measuringDevice;
  }

  public MeasuringDevice findByExternalIdForUpdateOrThrow(UUID deviceId) {
    return deviceRepository
        .findByExternalIdForUpdate(deviceId)
        .orElseThrow(
            () -> new NotFoundException("Measuring device %s not found.".formatted(deviceId)));
  }

  public void deleteDevice(MeasuringDevice measuringDevice) {
    SchoolEntryDeviceRegistryConfig config = getConfig();
    config.removeMeasuringDevice(measuringDevice);

    auditLogWriter.writeChangeToAuditLog(
        "schoolEntryDeviceRegistryConfiguration",
        getRelevantDeviceFieldsForLogging(measuringDevice),
        getRelevantDeviceFieldsForLogging(null));
  }

  public boolean existsByName(String name) {
    return deviceRepository.existsByName(name);
  }

  public boolean existsByEquipmentSelector(String equipmentSelector) {
    return deviceRepository.existsByEquipmentSelector(equipmentSelector);
  }
}
