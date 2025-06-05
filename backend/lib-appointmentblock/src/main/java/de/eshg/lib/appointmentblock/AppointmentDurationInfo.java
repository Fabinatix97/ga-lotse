/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import java.time.Duration;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;

public record AppointmentDurationInfo<T>(
    String name, Function<T, Duration> entityGetter, BiConsumer<T, Duration> entitySetter) {
  public static <T> Map.Entry<AppointmentType, AppointmentDurationInfo<T>> mapEntryOf(
      AppointmentType appointmentType,
      Function<T, Duration> entityGetter,
      BiConsumer<T, Duration> entitySetter) {
    return Map.entry(appointmentType, of(appointmentType, entityGetter, entitySetter));
  }

  public static <T> AppointmentDurationInfo<T> of(
      AppointmentType appointmentType,
      Function<T, Duration> entityGetter,
      BiConsumer<T, Duration> entitySetter) {
    return new AppointmentDurationInfo<>(
        appointmentType.toCamelCaseName(), entityGetter, entitySetter);
  }
}
