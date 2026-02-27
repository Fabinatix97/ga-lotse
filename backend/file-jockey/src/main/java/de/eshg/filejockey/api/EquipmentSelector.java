/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.api;

public record EquipmentSelector(String value) {

  public static final String EMPTY_MESSAGE = "Equipment selector must not be empty";

  public static EquipmentSelector of(String value) {
    return new EquipmentSelector(value);
  }
}
