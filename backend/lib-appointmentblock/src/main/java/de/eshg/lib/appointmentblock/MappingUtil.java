/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

public class MappingUtil {

  private MappingUtil() {}

  public static <E1 extends Enum<E1>, E2 extends Enum<E2>> E2 mapEnum(Class<E2> enumClass, E1 e1) {
    return (e1 == null ? null : E2.valueOf(enumClass, e1.name()));
  }
}
