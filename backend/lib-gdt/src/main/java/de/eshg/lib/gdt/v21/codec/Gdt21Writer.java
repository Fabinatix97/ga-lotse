/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.codec;

import de.eshg.lib.gdt.v21.model.Gdt21Field;
import de.eshg.lib.gdt.v21.model.Gdt21Record;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UncheckedIOException;
import java.io.Writer;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Set;

/**
 * Serializes {@link Gdt21Record} objects into a GDT 2.10 data stream.
 *
 * <p>Line format: {@code Length (3 bytes) + Tag (4 bytes) + Content + CRLF}. The length value
 * includes its own 3 bytes plus the 2-byte CRLF.
 *
 * <p>The writer automatically computes and emits field 8100 (total record byte count) as the second
 * line, immediately after field 8000, per the GDT 2.10 spec. It does NOT emit 9218 or 9206
 * automatically — builders are responsible.
 */
public class Gdt21Writer {

  static final int LENGTH_VALUE_DIGITS = 5;

  /** 3 (length prefix) + 4 (tag) + 2 (CRLF) */
  private static final int LINE_METADATA_SIZE = 9;

  private static final int MAX_CONTENT_LENGTH = 990;

  // Officially supported encodings for GDT 2.1
  private static final Set<Charset> SUPPORTED_CHARSETS =
      Set.of(Gdt21Constants.CHARSET_ASCII, Gdt21Constants.CHARSET_DOS, Gdt21Constants.CHARSET_ANSI);

  private final Charset charset;

  public Gdt21Writer() {
    this(Gdt21Constants.CHARSET_DEFAULT);
  }

  public Gdt21Writer(Charset charset) {
    if (!SUPPORTED_CHARSETS.contains(charset)) {
      throw new IllegalArgumentException(charset.name() + ": Unsupported GDT 2.10 charset");
    }
    this.charset = charset;
  }

  /**
   * Writes a single record to the output stream.
   *
   * <p>The provided {@code output} stream is closed when writing completes (or if an error occurs).
   *
   * @param record the record to write
   * @param output the output stream; will be closed by this method
   * @throws UncheckedIOException on I/O errors
   */
  public void write(Gdt21Record record, OutputStream output) {
    write(List.of(record), output);
  }

  /**
   * Writes a list of records to the output stream.
   *
   * <p>The provided {@code output} stream is closed when writing completes (or if an error occurs).
   *
   * @param records the records to write
   * @param output the output stream; will be closed by this method
   * @throws UncheckedIOException on I/O errors
   */
  public void write(List<Gdt21Record> records, OutputStream output) {
    try (Writer writer = new OutputStreamWriter(output, charset)) {
      for (Gdt21Record record : records) {
        writeRecord(writer, record);
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  /**
   * Writes a record to the writer. *
   *
   * <p>Per GDT 2.10 spec, the record must start with tag 8000, followed immediately by tag 8100
   * (total record length).
   */
  private void writeRecord(Writer writer, Gdt21Record record) throws IOException {
    // Filter out any existing 8100 tags to prevent double-emission.
    List<Gdt21Field> dataFields =
        record.fields().stream()
            .filter(f -> !Gdt21Constants.TAG_RECORD_LENGTH.equals(f.tag()))
            .toList();

    // Calculate the base byte size of all lines except the 8100 line.
    int baseSize =
        lineSize(record.recordType())
            + dataFields.stream().mapToInt(f -> lineSize(f.value())).sum();

    int totalBytes = baseSize + LINE_METADATA_SIZE + LENGTH_VALUE_DIGITS;
    if (totalBytes > 99_999) {
      throw new IllegalStateException(
          "Record too large: " + totalBytes + " bytes exceeds GDT 5-digit limit.");
    }

    // Emit fields in the strict order required by the specification.
    // Field 8000: Record Type
    writeLine(writer, Gdt21Constants.TAG_RECORD_TYPE, record.recordType());
    // Field 8100: Total Record Length, 5 digits, must be second
    writeLine(writer, Gdt21Constants.TAG_RECORD_LENGTH, String.format("%05d", totalBytes));
    // Data Fields
    for (Gdt21Field field : dataFields) {
      writeLine(writer, field.tag(), field.value());
    }
  }

  private int lineSize(String content) {
    if (content == null || content.isEmpty()) {
      return LINE_METADATA_SIZE;
    }
    // use the specific charset to determine byte length.
    return LINE_METADATA_SIZE + content.getBytes(charset).length;
  }

  private void writeLine(Writer writer, String tag, String content) throws IOException {
    if (content == null) {
      content = "";
    }
    if (content.length() > MAX_CONTENT_LENGTH) {
      throw new IllegalArgumentException(
          "Content exceeds maximum length: " + content.length() + " > " + MAX_CONTENT_LENGTH);
    }
    int totalLineLength = lineSize(content);
    writer.write(String.format("%03d", totalLineLength) + tag + content + Gdt21Constants.CRLF);
  }
}
