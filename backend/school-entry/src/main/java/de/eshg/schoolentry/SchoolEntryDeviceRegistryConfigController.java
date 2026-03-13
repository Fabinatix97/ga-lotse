/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.SchoolEntryDeviceRegistryConfigController.BASE_URL;
import static de.eshg.schoolentry.mapper.MeasuringDeviceMapper.mapMeasuringDeviceToDomain;
import static de.eshg.schoolentry.mapper.MeasuringDeviceMapper.mapMeasuringDeviceToDto;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls.DepartmentInfoLibrary;
import de.eshg.schoolentry.api.SchoolEntryFeature;
import de.eshg.schoolentry.api.configuration.AddSchoolEntryMeasurementDeviceRequest;
import de.eshg.schoolentry.api.configuration.GetSchoolEntryDeviceRegistryConfigResponse;
import de.eshg.schoolentry.api.configuration.MeasuringDeviceDto;
import de.eshg.schoolentry.api.configuration.UpdateSchoolEntryMeasurementDeviceRequest;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.domain.model.MeasuringDevice;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BASE_URL)
@Tag(name = "SchoolEntryDeviceRegistryConfig")
public class SchoolEntryDeviceRegistryConfigController {

  public static final String BASE_URL =
      DepartmentInfoLibrary.CONFIGURATION_API + "/school-entry/device-registry";

  private final SchoolEntryDeviceRegistryConfigService service;
  private final SchoolEntryFeatureToggle schoolEntryFeatureToggle;

  public SchoolEntryDeviceRegistryConfigController(
      SchoolEntryDeviceRegistryConfigService service,
      SchoolEntryFeatureToggle schoolEntryFeatureToggle) {
    this.service = service;
    this.schoolEntryFeatureToggle = schoolEntryFeatureToggle;
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetSchoolEntryDeviceRegistryConfigResponse getSchoolEntryDeviceRegistryConfig() {
    validateFeatureToggleEnabled();
    return new GetSchoolEntryDeviceRegistryConfigResponse(service.getConfiguration());
  }

  private void validateFeatureToggleEnabled() {
    if (!schoolEntryFeatureToggle.isNewFeatureEnabled(SchoolEntryFeature.MEASURING_DEVICES)) {
      throw new BadRequestException("Feature toggle for device registry is not enabled!");
    }
  }

  @PutMapping("/hearing-test-measuring")
  @Transactional
  public void updateHearingTestMeasuringToggle(@RequestParam("enabled") boolean enabled) {
    validateFeatureToggleEnabled();
    service.updateHearingTestMeasuringToggle(enabled);
  }

  @PutMapping("/seeing-test-measuring")
  @Transactional
  public void updateSeeingTestMeasuringToggle(@RequestParam("enabled") boolean enabled) {
    validateFeatureToggleEnabled();
    service.updateSeeingTestMeasuringToggle(enabled);
  }

  @PostMapping
  @Transactional
  public MeasuringDeviceDto addDevice(
      @Valid @RequestBody AddSchoolEntryMeasurementDeviceRequest request) {
    validateFeatureToggleEnabled();
    validateName(request.name());
    validateEquipmentSelector(request.equipmentSelector());

    MeasuringDevice measuringDevice = mapMeasuringDeviceToDomain(request);
    service.addMeasurementDevice(measuringDevice);

    return mapMeasuringDeviceToDto(measuringDevice);
  }

  private void validateName(String name) {
    if (service.existsByName(name)) {
      throw new BadRequestException("Name %s already exists.", name);
    }
  }

  private void validateEquipmentSelector(String equipmentSelector) {
    if (service.existsByEquipmentSelector(equipmentSelector)) {
      throw new BadRequestException("EquipmentSelector %s already exists.", equipmentSelector);
    }
  }

  @PutMapping("/{deviceId}")
  @Transactional
  public MeasuringDeviceDto updateDevice(
      @PathVariable("deviceId") UUID deviceId,
      @Valid @RequestBody UpdateSchoolEntryMeasurementDeviceRequest request) {
    validateFeatureToggleEnabled();
    MeasuringDevice measuringDevice = service.findByExternalIdForUpdateOrThrow(deviceId);
    if (!request.name().equals(measuringDevice.getName())) {
      validateName(request.name());
    }
    if (!request.equipmentSelector().equals(measuringDevice.getEquipmentSelector())) {
      validateEquipmentSelector(request.equipmentSelector());
    }
    ValidationUtil.validateVersion(request.version(), measuringDevice);
    MeasuringDevice updatedDevice = service.updateMeasurementDevice(measuringDevice, request);
    return mapMeasuringDeviceToDto(updatedDevice);
  }

  @DeleteMapping("/{deviceId}")
  @Transactional
  public void deleteDevice(@PathVariable("deviceId") UUID deviceId) {
    validateFeatureToggleEnabled();
    MeasuringDevice measuringDevice = service.findByExternalIdForUpdateOrThrow(deviceId);
    service.deleteDevice(measuringDevice);
  }

  @GetMapping("/validate-name")
  @Transactional(readOnly = true)
  public boolean validateNameIsUnique(@RequestParam("name") String name) {
    validateFeatureToggleEnabled();
    return !service.existsByName(name);
  }

  @GetMapping("/validate-equipment-selector")
  @Transactional(readOnly = true)
  public boolean validateEquipmentSelectorIsUnique(
      @RequestParam("equipmentSelector") String equipmentSelector) {
    validateFeatureToggleEnabled();
    return !service.existsByEquipmentSelector(equipmentSelector);
  }
}
