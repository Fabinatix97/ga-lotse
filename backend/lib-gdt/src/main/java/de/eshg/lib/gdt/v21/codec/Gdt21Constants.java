/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.codec;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

/** Protocol constants for the GDT 2.10 wire format. */
public final class Gdt21Constants {

  public static final String CRLF = "\r\n";

  public static final String TAG_RECORD_TYPE = "8000";

  /**
   * "Satzlänge" — mandatory second field in every record. Its 5-digit value gives the total byte
   * count of the record (from byte 0 of the 8000 line through the last CRLF of the last field).
   * This is the record boundary marker: a record is complete when the accumulated byte count equals
   * this value.
   */
  public static final String TAG_RECORD_LENGTH = "8100";

  /** Field 9218 value indicating GDT version. */
  public static final String TAG_VERSION = "9218";

  public static final String VERSION_VALUE = "02.10";

  /** Charset type used */
  public static final String TAG_CHARSET = "9206";

  /** Field 9206 value "1" — IBM 7-Bit ASCII. */
  public static final Charset CHARSET_ASCII = StandardCharsets.US_ASCII;

  /** Field 9206 value "2" — IBM CP-437 (DOS). */
  public static final Charset CHARSET_DOS = Charset.forName("IBM437");

  /** Field 9206 value "3" — CP-1252 (ANSI/Windows). */
  public static final Charset CHARSET_ANSI = Charset.forName("windows-1252");

  public static final Charset CHARSET_DEFAULT = CHARSET_ANSI;

  /** Field 9206 value indicating 7-bit ASCII encoding. */
  public static final String CHARSET_FIELD_ASCII = "1";

  /** Field 9206 value indicating CP-437 (DOS) encoding. */
  public static final String CHARSET_FIELD_DOS = "2";

  /** Field 9206 value indicating CP-1252 (ANSI/Windows) encoding. */
  public static final String CHARSET_FIELD_ANSI = "3";

  public static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("ddMMyyyy");
  public static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HHmmss");
  static final int LENGTH_PREFIX_SIZE = 3;
  static final int TAG_SIZE = 4;
  static final int MIN_LINE_LENGTH = LENGTH_PREFIX_SIZE + TAG_SIZE;
  static final int CRLF_SIZE = 2;

  private Gdt21Constants() {}
}
