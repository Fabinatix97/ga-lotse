/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.config;

import static de.cronn.commons.lang.StreamUtil.toLinkedHashMap;

import de.eshg.filejockey.exception.DeviceNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.UnaryOperator;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.util.unit.DataSize;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.file-jockey", ignoreUnknownFields = false)
public class FileJockeyProperties {

  public record RateLimit(
      @DefaultValue("100") @Positive int capacity,
      @DefaultValue("1") @Positive @DurationUnit(ChronoUnit.MINUTES) Duration intervalInMinutes) {}

  private final Map<String, @Valid Device> devicesByEquipmentSelector;

  public final DataSize maxRequestSize;

  public final DataSize defaultMaxFileSize;

  public final RateLimit rateLimit;

  public final Duration fileRetentionThreshold;

  public FileJockeyProperties(
      DataSize maxRequestSize,
      DataSize defaultMaxFileSize,
      List<Device> devices,
      @DefaultValue RateLimit rateLimit,
      @DefaultValue("7") @Positive @DurationUnit(ChronoUnit.DAYS) Duration fileRetentionThreshold) {
    this.maxRequestSize = maxRequestSize;
    this.defaultMaxFileSize = defaultMaxFileSize;
    this.rateLimit = rateLimit;
    this.fileRetentionThreshold = fileRetentionThreshold;
    UnaryOperator<Device> withDefaults = device -> device.withDefaults(defaultMaxFileSize);
    this.devicesByEquipmentSelector =
        Optional.ofNullable(devices).orElseGet(List::of).stream()
            .collect(toLinkedHashMap(Device::equipmentSelector, withDefaults));
  }

  public List<Device> getDevices() {
    return List.copyOf(devicesByEquipmentSelector.values());
  }

  public Optional<Device> getDevice(String equipmentSelector) {
    return Optional.ofNullable(devicesByEquipmentSelector.get(equipmentSelector));
  }

  public Device getDeviceOrThrow(String equipmentSelector) {
    return getDevice(equipmentSelector)
        .orElseThrow(
            () -> new DeviceNotFoundException("Unknown equipment selector: " + equipmentSelector));
  }

  public record Device(
      @NotBlank String equipmentSelector,
      DataSize maxFileSize,
      @NotNull @Valid DeviceInputFileProperties input,
      @NotNull @Valid DeviceOutputFileProperties output,
      @DefaultValue("ISO-8859-15") Charset charset) {

    Device withDefaults(DataSize defaultMaxFileSize) {
      return (maxFileSize != null)
          ? this
          : new Device(equipmentSelector, defaultMaxFileSize, input, output, charset);
    }
  }

  public record DeviceInputFileProperties(
      @NotNull Path folder, @NotBlank @ValidMessageFormat(2) String filenameTemplate) {}

  public record DeviceOutputFileProperties(
      @NotNull Path folder, @NotEmpty String embeddingPrefix, @NotEmpty String embeddingPostfix) {}
}
