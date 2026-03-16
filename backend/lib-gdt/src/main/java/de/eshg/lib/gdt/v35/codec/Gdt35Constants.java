/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.codec;

import java.nio.charset.Charset;

/**
 * Central constants for the GDT protocol.
 *
 * <p>Defines the character set and line termination rules mandated by the GDT specification.
 */
public final class Gdt35Constants {

  /**
   * The character set used for GDT files (ISO-8859-15).
   *
   * <p>GDT 3.5 strictly requires ISO-8859-15 to support European characters correctly. UTF-8 is NOT
   * supported.
   */
  public static final Charset CHARSET = Charset.forName("ISO-8859-15");

  /**
   * Every line of the GDT document must be ended with CRLF (Carriage Return + Line Feed).
   *
   * <p>The line length calculation includes these two bytes.
   */
  public static final String CRLF = "\r\n";

  /**
   * Tag 8000: Start record identification.
   *
   * <p>Marks the beginning of a GDT record. The value contains the record type.
   */
  public static final String TAG_RECORD_START = "8000";

  /**
   * Tag 8001: End of record.
   *
   * <p>Marks the end of a GDT record.
   */
  public static final String TAG_RECORD_END = "8001";

  /**
   * Tag 8002: Start of an object (Object identifier).
   *
   * <p>Marks the beginning of a nested GDT object.
   */
  public static final String TAG_OBJECT_START = "8002";

  /**
   * Tag 8003: End of an object (Object identifier).
   *
   * <p>Marks the end of a nested GDT object.
   */
  public static final String TAG_OBJECT_END = "8003";

  /** Start of the range for object attributes (8100). */
  public static final int TAG_OBJECT_ATTRIBUTE_START_RANGE = 8100;

  /** End of the range for object attributes (8299). */
  public static final int TAG_OBJECT_ATTRIBUTE_END_RANGE = 8299;

  private Gdt35Constants() {
    // prevent instantiation
  }
}
