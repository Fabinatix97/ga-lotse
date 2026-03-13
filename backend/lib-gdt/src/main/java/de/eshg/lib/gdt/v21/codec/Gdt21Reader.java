/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.codec;

import de.eshg.lib.gdt.v21.model.Gdt21Field;
import de.eshg.lib.gdt.v21.model.Gdt21Record;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Decodes GDT 2.10 data streams into {@link Gdt21Record} objects.
 *
 * <p>GDT 2.10 is a flat format — there are no nested objects, only fields. The charset is
 * determined dynamically: the stream is first decoded as CP-1252 to locate field 9206, then
 * re-decoded with the resolved charset (CP-1252 or CP-850).
 */
public class Gdt21Reader {

  private static final int MAX_LINE_LENGTH = 9999;
  private static final int MAX_TOTAL_LINES = 100_000;
  private static final int MAX_RECORD_COUNT = 10_000;
  private static final int MAX_INPUT_BYTES = 10 * 1024 * 1024;

  private static final Pattern TAG_PATTERN = Pattern.compile("\\d{4}");

  /**
   * Reads and parses a GDT 2.10 stream.
   *
   * <p>Two-pass algorithm: (1) read all bytes and probe with CP-1252 for field 9206; (2) re-decode
   * with the resolved charset and parse fully.
   *
   * @param input the input stream
   * @return list of parsed records (never null, may be empty)
   * @throws UncheckedIOException on I/O errors
   * @throws Gdt21ParseException on format violations
   */
  public List<Gdt21Record> read(InputStream input) {
    byte[] raw;
    try {
      raw = input.readNBytes(MAX_INPUT_BYTES + 1);
      if (raw.length > MAX_INPUT_BYTES) {
        throw new Gdt21ParseException(
            "Input exceeds maximum allowed size of " + MAX_INPUT_BYTES + " bytes");
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }

    Charset charset = detectCharset(raw);
    return parse(raw, charset);
  }

  private Charset detectCharset(byte[] raw) {
    // probe with CP-1252 to find field 9206
    try (BufferedReader probe =
        new BufferedReader(
            new InputStreamReader(new ByteArrayInputStream(raw), Gdt21Constants.CHARSET_DEFAULT))) {
      String line;
      while ((line = probe.readLine()) != null) {
        if (line.length() >= Gdt21Constants.MIN_LINE_LENGTH) {
          String tag =
              line.substring(
                  Gdt21Constants.LENGTH_PREFIX_SIZE,
                  Gdt21Constants.LENGTH_PREFIX_SIZE + Gdt21Constants.TAG_SIZE);
          if (Gdt21Constants.TAG_CHARSET.equals(tag)) {
            String value =
                line.substring(Gdt21Constants.LENGTH_PREFIX_SIZE + Gdt21Constants.TAG_SIZE);
            return switch (value) {
              case Gdt21Constants.CHARSET_FIELD_ASCII -> Gdt21Constants.CHARSET_ASCII;
              case Gdt21Constants.CHARSET_FIELD_DOS -> Gdt21Constants.CHARSET_DOS;
              case Gdt21Constants.CHARSET_FIELD_ANSI -> Gdt21Constants.CHARSET_ANSI;
              default -> Gdt21Constants.CHARSET_DEFAULT;
            };
          }
        }
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    return Gdt21Constants.CHARSET_DEFAULT;
  }

  private List<Gdt21Record> parse(byte[] raw, Charset charset) {
    List<Gdt21Record> records = new ArrayList<>();
    GdtRecordState state = new GdtRecordState();
    int lineCount = 0;

    try (BufferedReader reader =
        new BufferedReader(new InputStreamReader(new ByteArrayInputStream(raw), charset))) {
      String line;
      while ((line = reader.readLine()) != null) {
        lineCount++;

        if (line.isEmpty()) {
          continue;
        }
        assertLineConstraints(lineCount, line);

        int parsedLength = getParsedLength(line, lineCount);
        ParsedLine parsed = parseLine(line, lineCount);

        switch (parsed.tag()) {
          case Gdt21Constants.TAG_RECORD_TYPE ->
              handleRecordStart(state, parsed, parsedLength, lineCount);
          case Gdt21Constants.TAG_RECORD_LENGTH ->
              handleRecordLength(state, parsed, parsedLength, lineCount);
          default -> handleDataField(state, parsed, parsedLength, lineCount);
        }

        tryCollectRecord(state, records);
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }

    if (state.isOpen()) {
      throw new Gdt21ParseException("Stream ended with unclosed record");
    }

    return records;
  }

  private static void tryCollectRecord(GdtRecordState state, List<Gdt21Record> records) {
    // Byte-count boundary: record is complete when accumulated bytes equal 8100 value
    Gdt21Record completed = state.tryFinalize();
    if (completed != null) {
      if (records.size() >= MAX_RECORD_COUNT) {
        throw new Gdt21ParseException("Stream exceeds maximum record count: " + MAX_RECORD_COUNT);
      }
      records.add(completed);
    }
  }

  private static void assertLineConstraints(int lineCount, String line) {
    if (lineCount > MAX_TOTAL_LINES) {
      throw new Gdt21ParseException("Stream exceeds maximum line count: " + MAX_TOTAL_LINES);
    }
    if (line.length() > MAX_LINE_LENGTH) {
      throw new Gdt21ParseException(
          "Line exceeds maximum length at line " + lineCount + ": " + line.length());
    }
    if (line.length() < Gdt21Constants.MIN_LINE_LENGTH) {
      throw new Gdt21ParseException("Line too short at line " + lineCount + ": " + line.length());
    }
  }

  private static void handleRecordStart(
      GdtRecordState state, ParsedLine parsed, int parsedLength, int lineCount) {
    if (state.isOpen()) {
      throw new Gdt21ParseException("Nested or unclosed record at line " + lineCount);
    }
    state.open(parsed.value(), parsedLength);
  }

  private static void handleRecordLength(
      GdtRecordState state, ParsedLine parsed, int parsedLength, int lineCount) {
    state.requireOpen(parsed.tag(), lineCount);
    state.byteCount += parsedLength;
    // 8100 is infrastructure (boundary marker), not a data field
    try {
      state.declaredTotalBytes = Integer.parseInt(parsed.value());
    } catch (NumberFormatException e) {
      throw new Gdt21ParseException("Invalid length format at line " + lineCount);
    }
  }

  private static void handleDataField(
      GdtRecordState state, ParsedLine parsed, int parsedLength, int lineCount) {
    state.requireOpen(parsed.tag(), lineCount);
    state.byteCount += parsedLength;
    state.fields.add(new Gdt21Field(parsed.tag(), parsed.value()));
  }

  private static final class GdtRecordState {

    private String recordType;
    private List<Gdt21Field> fields;
    private int byteCount;
    private Integer declaredTotalBytes;

    boolean isOpen() {
      return recordType != null;
    }

    void open(String type, int firstLineBytes) {
      this.recordType = type;
      this.fields = new ArrayList<>();
      this.byteCount = firstLineBytes;
      this.declaredTotalBytes = null;
    }

    void requireOpen(String tag, int lineCount) {
      if (!isOpen()) {
        throw new Gdt21ParseException(
            "Field " + tag + " encountered outside of record context at line " + lineCount);
      }
    }

    Gdt21Record tryFinalize() {
      if (declaredTotalBytes == null || byteCount != declaredTotalBytes) {
        return null;
      }
      Gdt21Record record = new Gdt21Record(recordType, fields);
      recordType = null;
      fields = null;
      byteCount = 0;
      declaredTotalBytes = null;
      return record;
    }
  }

  private record ParsedLine(String tag, String value) {}

  private static ParsedLine parseLine(String line, int lineCount) {
    String tag =
        line.substring(
            Gdt21Constants.LENGTH_PREFIX_SIZE,
            Gdt21Constants.LENGTH_PREFIX_SIZE + Gdt21Constants.TAG_SIZE);
    if (!TAG_PATTERN.matcher(tag).matches()) {
      throw new Gdt21ParseException("Invalid tag at line " + lineCount);
    }
    return new ParsedLine(
        tag, line.substring(Gdt21Constants.LENGTH_PREFIX_SIZE + Gdt21Constants.TAG_SIZE));
  }

  private static int getParsedLength(String line, int lineCount) {
    int parsedLength;
    String substring = line.substring(0, Gdt21Constants.LENGTH_PREFIX_SIZE);
    try {
      parsedLength = Integer.parseInt(substring);
    } catch (NumberFormatException e) {
      throw new Gdt21ParseException("Invalid length prefix at line " + lineCount);
    }

    if (line.length() != parsedLength - Gdt21Constants.CRLF_SIZE) {
      throw new Gdt21ParseException(
          "Length mismatch at line "
              + lineCount
              + ": declared="
              + parsedLength
              + ", actual(+CRLF)="
              + (line.length() + Gdt21Constants.CRLF_SIZE));
    }
    return parsedLength;
  }
}
