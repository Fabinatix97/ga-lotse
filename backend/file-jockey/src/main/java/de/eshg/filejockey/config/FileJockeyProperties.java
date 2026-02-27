/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.config;

import static java.util.stream.Collectors.toMap;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.util.unit.DataSize;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.file-jockey", ignoreUnknownFields = false)
public class FileJockeyProperties {

  @NotNull private final DataSize defaultMaxFileSize;

  private final Map<String, @Valid Device> devicesByEquipmentSelector;

  public FileJockeyProperties(DataSize defaultMaxFileSize, List<Device> devices) {
    this.defaultMaxFileSize = defaultMaxFileSize;
    this.devicesByEquipmentSelector =
        Optional.ofNullable(devices).orElseGet(List::of).stream()
            .collect(
                toMap(
                    Device::equipmentSelector,
                    Function.identity(),
                    (a, _) -> {
                      throw new IllegalStateException(
                          "Found unexpected duplicate: " + a.equipmentSelector());
                    },
                    LinkedHashMap::new));
  }

  public List<Device> getDevices() {
    return List.copyOf(devicesByEquipmentSelector.values());
  }

  public Optional<Device> getDevice(String equipmentSelector) {
    return Optional.ofNullable(devicesByEquipmentSelector.get(equipmentSelector));
  }

  public DataSize getMaxFileSizeForDevice(String equipmentSelector) {
    Device device = devicesByEquipmentSelector.get(equipmentSelector);
    if (device == null) {
      throw new IllegalArgumentException("Device not found: " + equipmentSelector);
    }
    return Objects.requireNonNullElse(device.maxFileSize(), defaultMaxFileSize);
  }

  public record Device(
      @NotBlank String equipmentSelector,
      DataSize maxFileSize,
      @NotNull @Valid DeviceInputFileProperties input,
      @NotNull @Valid DeviceOutputFileProperties output,
      @DefaultValue("ISO-8859-15") Charset charset) {}

  public record DeviceInputFileProperties(
      @NotNull Path folder, @NotBlank String fileNamePrefix, @NotBlank String fileNamePostfix) {}

  public record DeviceOutputFileProperties(
      @NotNull Path folder, @NotEmpty String embeddingPrefix, @NotEmpty String embeddingPostfix) {}
}
