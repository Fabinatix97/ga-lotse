/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.codec;

import de.eshg.lib.gdt.v35.model.Gdt35Element;
import de.eshg.lib.gdt.v35.model.Gdt35Field;
import de.eshg.lib.gdt.v35.model.Gdt35Object;
import de.eshg.lib.gdt.v35.model.Gdt35Record;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

/**
 * Decodes GDT data streams into {@link Gdt35Record} objects.
 *
 * <p>Handles the line-based structure of GDT files:
 *
 * <ul>
 *   <li>Validates the 3-digit length prefix.
 *   <li>Recursively parses nested objects (8002 start / 8003 end).
 *   <li>Associates Attribute Tags (81xx) with the subsequent objects.
 * </ul>
 */
public class GdtReader {

  /**
   * Size of the line length prefix in bytes.
   *
   * <p>According to GDT 3.5 (Section 6.5.1), the first 3 bytes of every line contain a 3-digit
   * natural number representing the total length of the line.
   */
  private static final int LENGTH_PREFIX_SIZE = 3;

  /**
   * Size of the field identifier (tag) in bytes.
   *
   * <p>According to GDT 3.5 (Section 6.5.1), the field identifier consists of a 4-digit natural
   * number following the length prefix.
   */
  private static final int TAG_SIZE = 4;

  /**
   * Minimum length of a line string as returned by {@link BufferedReader#readLine()}.
   *
   * <p>A valid GDT line must at least contain the 3-byte length prefix and the 4-byte tag. Since
   * readLine() strips the CRLF, the minimum string length is 7.
   */
  private static final int MIN_LINE_LENGTH = LENGTH_PREFIX_SIZE + TAG_SIZE;

  /**
   * Size of the line terminator (CRLF) in bytes.
   *
   * <p>GDT 3.5 mandates that every line ends with Carriage Return (0x0D) and Line Feed (0x0A).
   * These 2 bytes are included in the total line length calculation.
   */
  private static final int CRLF_SIZE = 2;

  private static final int MAX_LINE_LENGTH = 9999; // GDT spec max: 999 bytes + metadata
  private static final int MAX_TOTAL_LINES = 100_000; // Reasonable limit
  private static final int MAX_NESTING_DEPTH = 10; // Reasonable for medical data

  /**
   * Reads and parses a GDT stream.
   *
   * @param input The input stream (will be read as ISO-8859-15).
   * @return A list of parsed GDT records.
   * @throws UncheckedIOException If an I/O error occurs.
   * @throws Gdt35ParseException If the GDT format is invalid (e.g., length mismatch, unclosed
   *     objects).
   */
  public List<Gdt35Record> read(InputStream input) {
    List<Gdt35Record> records = new ArrayList<>();
    ParsingContext context = new ParsingContext();

    try (BufferedReader reader =
        new BufferedReader(new InputStreamReader(input, Gdt35Constants.CHARSET))) {
      while ((context.currentLine = reader.readLine()) != null) {
        context.lineCount++;
        if (context.currentLine.isEmpty()) {
          continue;
        }
        if (context.lineCount > MAX_TOTAL_LINES) {
          throw new Gdt35ParseException("File exceeds maximum line count: " + MAX_TOTAL_LINES);
        }

        Gdt35Field field = parseLine(context);
        processField(field, context, records);
      }
      validateFinalState(context);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    return records;
  }

  private Gdt35Field parseLine(ParsingContext context) {
    String line = context.currentLine;
    int length = line.length();
    if (length > MAX_LINE_LENGTH) {
      throw new Gdt35ParseException("Line exceeds maximum length: " + length);
    }
    if (length < MIN_LINE_LENGTH) {
      throw new Gdt35ParseException("Line too short: expected at least " + MIN_LINE_LENGTH);
    }

    int declaredLength;
    try {
      declaredLength = Integer.parseInt(line.substring(0, LENGTH_PREFIX_SIZE));
    } catch (NumberFormatException e) {
      throw new Gdt35ParseException("Invalid length format at line " + context.lineCount);
    }

    if (length != declaredLength - CRLF_SIZE) {
      throw new Gdt35ParseException(
          "Length mismatch. Declared: "
              + declaredLength
              + ", Actual (+CRLF): "
              + (length + CRLF_SIZE)
              + ". At line "
              + context.lineCount);
    }

    String tag = line.substring(LENGTH_PREFIX_SIZE, LENGTH_PREFIX_SIZE + TAG_SIZE);
    if (!tag.matches("\\d{4}")) {
      throw new Gdt35ParseException(
          "Invalid tag format: must be 4 digits, got '" + tag + "' at line " + context.lineCount);
    }

    String value = line.substring(LENGTH_PREFIX_SIZE + TAG_SIZE);
    return new Gdt35Field(tag, value);
  }

  private void processField(Gdt35Field field, ParsingContext context, List<Gdt35Record> records) {
    switch (field.tag()) {
      case Gdt35Constants.TAG_RECORD_START -> handleRecordStart(field.value(), context);
      case Gdt35Constants.TAG_RECORD_END -> handleRecordEnd(context, records);
      case Gdt35Constants.TAG_OBJECT_START -> handleObjectStart(field.value(), context);
      case Gdt35Constants.TAG_OBJECT_END -> handleObjectEnd(field.value(), context);
      default -> handleDefaultField(field, context);
    }
  }

  private void handleRecordStart(String recordType, ParsingContext context) {
    if (context.currentRecord != null) {
      throw new Gdt35ParseException(
          "Nested or unclosed record found at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }
    context.currentRecord = new GdtRecordBuilder(recordType);
    context.objectStack.clear();
    context.pendingAttribute = null;
  }

  private void handleRecordEnd(ParsingContext context, List<Gdt35Record> records) {
    if (context.currentRecord == null) {
      throw new Gdt35ParseException(
          "End of record without start at line " + context.lineCount + ": " + context.currentLine);
    }
    if (!context.objectStack.isEmpty()) {
      throw new Gdt35ParseException(
          "Record ended with unclosed objects at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }
    if (context.pendingAttribute != null) {
      addToCurrentContext(context, context.pendingAttribute);
      context.pendingAttribute = null;
    }
    records.add(context.currentRecord.build());
    context.currentRecord = null;
  }

  private void handleObjectStart(String objectId, ParsingContext context) {
    if (context.currentRecord == null) {
      throw new Gdt35ParseException(
          "Object start "
              + Gdt35Constants.TAG_OBJECT_START
              + " encountered outside of a record context at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }
    String attrTag = (context.pendingAttribute != null) ? context.pendingAttribute.tag() : null;
    String attrName =
        (context.pendingAttribute != null) ? context.pendingAttribute.value() : "Unknown";
    context.pendingAttribute = null;

    GdtObjectBuilder newObj = new GdtObjectBuilder(attrTag, attrName, objectId);
    if (context.objectStack.size() >= MAX_NESTING_DEPTH) {
      throw new Gdt35ParseException(
          "Maximum nesting depth exceeded: "
              + MAX_NESTING_DEPTH
              + " at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }
    context.objectStack.push(newObj);
  }

  private void handleObjectEnd(String objectId, ParsingContext context) {
    if (context.objectStack.isEmpty()) {
      throw new Gdt35ParseException(
          "Object end "
              + Gdt35Constants.TAG_OBJECT_END
              + " without start at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }

    GdtObjectBuilder finishedObj = context.objectStack.pop();
    if (!finishedObj.objectId.equals(objectId)) {
      throw new Gdt35ParseException(
          "Object ID mismatch. Start: "
              + finishedObj.objectId
              + ", End: "
              + objectId
              + " at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }

    if (finishedObj.elements.isEmpty()) {
      throw new Gdt35ParseException(
          "Empty object "
              + objectId
              + " at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }

    if (context.pendingAttribute != null) {
      finishedObj.elements.add(context.pendingAttribute);
      context.pendingAttribute = null;
    }

    addToCurrentContext(context, finishedObj.build());
  }

  private void handleDefaultField(Gdt35Field field, ParsingContext context) {
    if (context.pendingAttribute != null) {
      addToCurrentContext(context, context.pendingAttribute);
    }

    // Tag is already validated as 4 digits in parseLine, so parseInt is safe
    int tagNum = Integer.parseInt(field.tag());

    // Attribute tags (81xx range) are held pending until next object/field
    if (tagNum >= Gdt35Constants.TAG_OBJECT_ATTRIBUTE_START_RANGE
        && tagNum <= Gdt35Constants.TAG_OBJECT_ATTRIBUTE_END_RANGE) {
      context.pendingAttribute = field;
    } else {
      context.pendingAttribute = null;
      addToCurrentContext(context, field);
    }
  }

  private void validateFinalState(ParsingContext context) {
    if (context.currentRecord != null) {
      throw new Gdt35ParseException(
          "Stream ended with unclosed record. Last line was " + context.lineCount);
    }
  }

  private void addToCurrentContext(ParsingContext context, Gdt35Element element) {
    if (context.objectStack.isEmpty()) {
      if (context.currentRecord != null) {
        context.currentRecord.elements.add(element);
      } else {
        throw new Gdt35ParseException(
            "Field encountered outside of record context at line "
                + context.lineCount
                + ": "
                + context.currentLine);
      }
    } else {
      context.objectStack.peek().elements.add(element);
    }
  }

  private static class ParsingContext {
    GdtRecordBuilder currentRecord = null;
    final Deque<GdtObjectBuilder> objectStack = new ArrayDeque<>();
    Gdt35Field pendingAttribute = null;
    int lineCount = 0;
    String currentLine = "";
  }

  private static class GdtRecordBuilder {

    final String recordType;
    final List<Gdt35Element> elements = new ArrayList<>();

    GdtRecordBuilder(String recordType) {
      this.recordType = recordType;
    }

    Gdt35Record build() {
      return new Gdt35Record(recordType, elements);
    }
  }

  private static class GdtObjectBuilder {

    final String attributeTag;
    final String attributeName;
    final String objectId;
    final List<Gdt35Element> elements = new ArrayList<>();

    GdtObjectBuilder(String attributeTag, String attributeName, String objectId) {
      this.attributeTag = attributeTag;
      this.attributeName = attributeName;
      this.objectId = objectId;
    }

    Gdt35Object build() {
      return new Gdt35Object(attributeTag, attributeName, objectId, elements);
    }
  }
}
