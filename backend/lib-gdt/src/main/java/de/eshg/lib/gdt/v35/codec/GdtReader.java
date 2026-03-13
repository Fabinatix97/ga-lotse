/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.codec;

import de.eshg.lib.gdt.v35.model.GdtElement;
import de.eshg.lib.gdt.v35.model.GdtField;
import de.eshg.lib.gdt.v35.model.GdtObject;
import de.eshg.lib.gdt.v35.model.GdtRecord;
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
 * Decodes GDT data streams into {@link GdtRecord} objects.
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
   * @throws GdtParseException If the GDT format is invalid (e.g., length mismatch, unclosed
   *     objects).
   */
  public List<GdtRecord> read(InputStream input) {
    List<GdtRecord> records = new ArrayList<>();
    ParsingContext context = new ParsingContext();

    try (BufferedReader reader =
        new BufferedReader(new InputStreamReader(input, GdtConstants.CHARSET))) {
      while ((context.currentLine = reader.readLine()) != null) {
        context.lineCount++;
        if (context.currentLine.isEmpty()) {
          continue;
        }
        if (context.lineCount > MAX_TOTAL_LINES) {
          throw new GdtParseException("File exceeds maximum line count: " + MAX_TOTAL_LINES);
        }

        GdtField field = parseLine(context);
        processField(field, context, records);
      }
      validateFinalState(context);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    return records;
  }

  private GdtField parseLine(ParsingContext context) {
    String line = context.currentLine;
    int length = line.length();
    if (length > MAX_LINE_LENGTH) {
      throw new GdtParseException("Line exceeds maximum length: " + length);
    }
    if (length < MIN_LINE_LENGTH) {
      throw new GdtParseException("Line too short: expected at least " + MIN_LINE_LENGTH);
    }

    int declaredLength;
    try {
      declaredLength = Integer.parseInt(line.substring(0, LENGTH_PREFIX_SIZE));
    } catch (NumberFormatException e) {
      throw new GdtParseException("Invalid length format at line " + context.lineCount);
    }

    if (length != declaredLength - CRLF_SIZE) {
      throw new GdtParseException(
          "Length mismatch. Declared: "
              + declaredLength
              + ", Actual (+CRLF): "
              + (length + CRLF_SIZE)
              + ". At line "
              + context.lineCount);
    }

    String tag = line.substring(LENGTH_PREFIX_SIZE, LENGTH_PREFIX_SIZE + TAG_SIZE);
    if (!tag.matches("\\d{4}")) {
      throw new GdtParseException(
          "Invalid tag format: must be 4 digits, got '" + tag + "' at line " + context.lineCount);
    }

    String value = line.substring(LENGTH_PREFIX_SIZE + TAG_SIZE);
    return new GdtField(tag, value);
  }

  private void processField(GdtField field, ParsingContext context, List<GdtRecord> records) {
    switch (field.tag()) {
      case GdtConstants.TAG_RECORD_START -> handleRecordStart(field.value(), context);
      case GdtConstants.TAG_RECORD_END -> handleRecordEnd(context, records);
      case GdtConstants.TAG_OBJECT_START -> handleObjectStart(field.value(), context);
      case GdtConstants.TAG_OBJECT_END -> handleObjectEnd(field.value(), context);
      default -> handleDefaultField(field, context);
    }
  }

  private void handleRecordStart(String recordType, ParsingContext context) {
    if (context.currentRecord != null) {
      throw new GdtParseException(
          "Nested or unclosed record found at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }
    context.currentRecord = new GdtRecordBuilder(recordType);
    context.objectStack.clear();
    context.pendingAttribute = null;
  }

  private void handleRecordEnd(ParsingContext context, List<GdtRecord> records) {
    if (context.currentRecord == null) {
      throw new GdtParseException(
          "End of record without start at line " + context.lineCount + ": " + context.currentLine);
    }
    if (!context.objectStack.isEmpty()) {
      throw new GdtParseException(
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
      throw new GdtParseException(
          "Object start "
              + GdtConstants.TAG_OBJECT_START
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
      throw new GdtParseException(
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
      throw new GdtParseException(
          "Object end "
              + GdtConstants.TAG_OBJECT_END
              + " without start at line "
              + context.lineCount
              + ": "
              + context.currentLine);
    }

    GdtObjectBuilder finishedObj = context.objectStack.pop();
    if (!finishedObj.objectId.equals(objectId)) {
      throw new GdtParseException(
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
      throw new GdtParseException(
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

  private void handleDefaultField(GdtField field, ParsingContext context) {
    if (context.pendingAttribute != null) {
      addToCurrentContext(context, context.pendingAttribute);
    }

    // Tag is already validated as 4 digits in parseLine, so parseInt is safe
    int tagNum = Integer.parseInt(field.tag());

    // Attribute tags (81xx range) are held pending until next object/field
    if (tagNum >= GdtConstants.TAG_OBJECT_ATTRIBUTE_START_RANGE
        && tagNum <= GdtConstants.TAG_OBJECT_ATTRIBUTE_END_RANGE) {
      context.pendingAttribute = field;
    } else {
      context.pendingAttribute = null;
      addToCurrentContext(context, field);
    }
  }

  private void validateFinalState(ParsingContext context) {
    if (context.currentRecord != null) {
      throw new GdtParseException(
          "Stream ended with unclosed record. Last line was " + context.lineCount);
    }
  }

  private void addToCurrentContext(ParsingContext context, GdtElement element) {
    if (context.objectStack.isEmpty()) {
      if (context.currentRecord != null) {
        context.currentRecord.elements.add(element);
      } else {
        throw new GdtParseException(
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
    GdtField pendingAttribute = null;
    int lineCount = 0;
    String currentLine = "";
  }

  private static class GdtRecordBuilder {

    final String recordType;
    final List<GdtElement> elements = new ArrayList<>();

    GdtRecordBuilder(String recordType) {
      this.recordType = recordType;
    }

    GdtRecord build() {
      return new GdtRecord(recordType, elements);
    }
  }

  private static class GdtObjectBuilder {

    final String attributeTag;
    final String attributeName;
    final String objectId;
    final List<GdtElement> elements = new ArrayList<>();

    GdtObjectBuilder(String attributeTag, String attributeName, String objectId) {
      this.attributeTag = attributeTag;
      this.attributeName = attributeName;
      this.objectId = objectId;
    }

    GdtObject build() {
      return new GdtObject(attributeTag, attributeName, objectId, elements);
    }
  }
}
