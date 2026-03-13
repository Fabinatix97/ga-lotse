/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.builder;

/** GDT 2.10 sex / gender values for field 3110. */
public enum Gdt21Sex {
  MALE("1"),
  FEMALE("2");

  private final String code;

  Gdt21Sex(String code) {
    this.code = code;
  }

  public String code() {
    return code;
  }
}
