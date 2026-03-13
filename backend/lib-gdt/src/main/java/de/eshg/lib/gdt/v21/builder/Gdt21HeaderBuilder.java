/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.builder;

import de.eshg.lib.gdt.v21.codec.Gdt21Constants;
import de.eshg.lib.gdt.v21.model.Gdt21Field;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Builds the top-level header fields for a GDT 2.10 record. Always emits field 9218="02.10". */
public class Gdt21HeaderBuilder {

  private final List<Gdt21Field> fields = new ArrayList<>();
  private final Set<String> usedTags = new HashSet<>();

  /** Field 8316 — sender identification (max 8 chars). */
  public Gdt21HeaderBuilder sender(String sender) {
    requireMaxLength("8316", sender, 8);
    addSingleInstance("8316", sender);
    return this;
  }

  /** Field 8315 — receiver identification (max 8 chars). */
  public Gdt21HeaderBuilder receiver(String receiver) {
    requireMaxLength("8315", receiver, 8);
    addSingleInstance("8315", receiver);
    return this;
  }

  /**
   * Field 9206 — character set. Accepts one of the supported GDT 2.10 charsets: {@link
   * Gdt21Constants#CHARSET_ASCII}, {@link Gdt21Constants#CHARSET_DOS}, or {@link
   * Gdt21Constants#CHARSET_ANSI}.
   *
   * @throws IllegalArgumentException if the charset is not a supported GDT 2.10 charset
   */
  public Gdt21HeaderBuilder charset(Charset charset) {
    String code;
    if (Gdt21Constants.CHARSET_ASCII.equals(charset)) {
      code = Gdt21Constants.CHARSET_FIELD_ASCII;
    } else if (Gdt21Constants.CHARSET_DOS.equals(charset)) {
      code = Gdt21Constants.CHARSET_FIELD_DOS;
    } else if (Gdt21Constants.CHARSET_ANSI.equals(charset)) {
      code = Gdt21Constants.CHARSET_FIELD_ANSI;
    } else {
      throw new IllegalArgumentException("Unsupported GDT 2.10 charset: " + charset.name());
    }
    addSingleInstance(Gdt21Constants.TAG_CHARSET, code);
    return this;
  }

  List<Gdt21Field> build() {
    List<Gdt21Field> result = new ArrayList<>();
    // Version field is always emitted first
    result.add(new Gdt21Field(Gdt21Constants.TAG_VERSION, Gdt21Constants.VERSION_VALUE));
    result.addAll(fields);
    return result;
  }

  private void addSingleInstance(String tag, String value) {
    if (!usedTags.add(tag)) {
      throw new IllegalStateException("Field " + tag + " already set");
    }
    fields.add(new Gdt21Field(tag, value));
  }

  private static void requireMaxLength(String tag, String value, int max) {
    if (value != null && value.length() > max) {
      throw new IllegalArgumentException(
          "Field " + tag + " exceeds maximum length " + max + ": " + value.length());
    }
  }
}
