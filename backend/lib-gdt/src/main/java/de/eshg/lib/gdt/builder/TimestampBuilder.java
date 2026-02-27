/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.builder;

/**
 * Builder for Timestamp objects (Obj_0054 / Obj_Timestamp).
 *
 * <p>Defines a point in time, consisting of a date and time. Used for creation dates, measurement
 * times, etc.
 */
public class TimestampBuilder extends BaseBuilder<TimestampBuilder> {

  @Override
  protected TimestampBuilder self() {
    return this;
  }

  /**
   * Sets the Date (7278).
   *
   * @param value The date in "YYYYMMDD" format (e.g., "20231024").
   * @return This builder instance.
   */
  public TimestampBuilder date(String value) { // Format YYYYMMDD
    return addField("7278", value); // 7278 is common date tag in timestamp object, need to verify
  }

  /**
   * Sets the Time (7279).
   *
   * @param value The time in "HHMMSS" format (e.g., "143000" for 14:30:00).
   * @return This builder instance.
   */
  public TimestampBuilder time(String value) { // Format HHMMSS
    return addField("7279", value); // 7279 is common time tag
  }

  // Sometimes 8432/8439 are used?
  // In AIS_SYS_6310.gdt:
  // 017727819981023 -> 7278
  // 0157279173510 -> 7279
  // 0147273UTC+2 -> 7273
}
