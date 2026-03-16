/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.configuration.AddSchoolEntryMeasurementDeviceRequest;
import de.eshg.schoolentry.api.configuration.GdtDriverDto;
import de.eshg.schoolentry.api.configuration.MeasuringDeviceDto;
import de.eshg.schoolentry.api.configuration.MeasuringDeviceTypeDto;
import de.eshg.schoolentry.api.configuration.SchoolEntryDeviceRegistryConfigDto;
import de.eshg.schoolentry.domain.model.GdtDriver;
import de.eshg.schoolentry.domain.model.MeasuringDevice;
import de.eshg.schoolentry.domain.model.MeasuringDeviceType;
import de.eshg.schoolentry.domain.model.SchoolEntryDeviceRegistryConfig;
import java.util.List;

public class MeasuringDeviceMapper {

  private MeasuringDeviceMapper() {}

  public static SchoolEntryDeviceRegistryConfigDto mapConfigToDto(
      SchoolEntryDeviceRegistryConfig config) {
    return new SchoolEntryDeviceRegistryConfigDto(
        config.isHearingTestDeviceMeasuring(),
        config.isSeeingTestDeviceMeasuring(),
        mapMeasuringDeviceToDto(config.getMeasuringDevices()));
  }

  public static List<MeasuringDeviceDto> mapMeasuringDeviceToDto(List<MeasuringDevice> devices) {
    return devices.stream().map(MeasuringDeviceMapper::mapMeasuringDeviceToDto).toList();
  }

  public static MeasuringDeviceDto mapMeasuringDeviceToDto(MeasuringDevice device) {
    return new MeasuringDeviceDto(
        device.getExternalId(),
        device.getVersion(),
        mapMeasuringDeviceTypeToDto(device.getMeasuringDeviceType()),
        device.getName(),
        device.getEquipmentSelector(),
        mapGdtDriverToDto(device.getDriver()));
  }

  public static GdtDriverDto mapGdtDriverToDto(GdtDriver driver) {
    return switch (driver) {
      case OSCILLA_AUDIO_CONSOLE -> GdtDriverDto.OSCILLA_AUDIO_CONSOLE;
    };
  }

  public static MeasuringDeviceTypeDto mapMeasuringDeviceTypeToDto(
      MeasuringDeviceType measuringDeviceType) {
    return switch (measuringDeviceType) {
      case HEARING_TEST -> MeasuringDeviceTypeDto.HEARING_TEST;
      case SEEING_TEST -> MeasuringDeviceTypeDto.SEEING_TEST;
    };
  }

  public static MeasuringDevice mapMeasuringDeviceToDomain(
      AddSchoolEntryMeasurementDeviceRequest request) {
    MeasuringDevice measuringDevice = new MeasuringDevice();
    measuringDevice.setMeasuringDeviceType(mapMeasuringDeviceTypeToDomain(request.deviceType()));
    measuringDevice.setName(request.name());
    measuringDevice.setEquipmentSelector(request.equipmentSelector());
    measuringDevice.setDriver(mapGdtDriverToDomain(request.gdtDriver()));
    return measuringDevice;
  }

  public static GdtDriver mapGdtDriverToDomain(GdtDriverDto dto) {
    return switch (dto) {
      case OSCILLA_AUDIO_CONSOLE -> GdtDriver.OSCILLA_AUDIO_CONSOLE;
    };
  }

  public static MeasuringDeviceType mapMeasuringDeviceTypeToDomain(MeasuringDeviceTypeDto dto) {
    return switch (dto) {
      case HEARING_TEST -> MeasuringDeviceType.HEARING_TEST;
      case SEEING_TEST -> MeasuringDeviceType.SEEING_TEST;
    };
  }
}
