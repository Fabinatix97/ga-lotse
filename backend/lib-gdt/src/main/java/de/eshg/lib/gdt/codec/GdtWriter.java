/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.codec;

import de.eshg.lib.gdt.model.GdtElement;
import de.eshg.lib.gdt.model.GdtField;
import de.eshg.lib.gdt.model.GdtObject;
import de.eshg.lib.gdt.model.GdtRecord;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UncheckedIOException;
import java.io.Writer;
import java.util.List;

/**
 * Serializes {@link GdtRecord} objects into a GDT data stream.
 *
 * <p>Ensures the correct line format: <code>Length (3 bytes) + Tag (4 bytes) + Content + CRLF
 * </code> <br>
 * The length calculation includes the 3 bytes for length and the 2 bytes for CRLF.
 */
public class GdtWriter {

  private static final int LINE_METADATA_SIZE = 9; // 3 (Length) + 4 (Tag) + 2 (CRLF)
  private static final int MAX_CONTENT_LENGTH = 990;

  /**
   * Writes a list of records to the output stream.
   *
   * @param records The records to write.
   * @param output The output stream (written as ISO-8859-15).
   * @throws UncheckedIOException If an I/O error occurs.
   */
  public void write(List<GdtRecord> records, OutputStream output) {
    try (Writer writer = new OutputStreamWriter(output, GdtConstants.CHARSET)) {
      for (GdtRecord rec : records) {
        writeRecord(writer, rec);
      }
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  /**
   * Writes a single record to the output stream.
   *
   * @param record The record to write.
   * @param output The output stream (written as ISO-8859-15).
   * @throws UncheckedIOException If an I/O error occurs.
   */
  public void write(GdtRecord record, OutputStream output) {
    write(List.of(record), output);
  }

  private void writeRecord(Writer writer, GdtRecord rec) throws IOException {
    // Record Start
    writeLine(writer, GdtConstants.TAG_RECORD_START, rec.recordType());

    // Elements (Fields and Objects mixed)
    for (GdtElement element : rec.elements()) {
      writeElement(writer, element);
    }

    // Record End
    writeLine(writer, GdtConstants.TAG_RECORD_END, rec.recordType());
  }

  private void writeElement(Writer writer, GdtElement element) throws IOException {
    if (element instanceof GdtField(String tag, String value)) {
      writeLine(writer, tag, value);
    } else if (element instanceof GdtObject object) {
      writeObject(writer, object);
    }
  }

  private void writeObject(Writer writer, GdtObject object) throws IOException {
    // Attribute Field (if tag exists)
    if (object.attributeTag() != null) {
      writeLine(writer, object.attributeTag(), object.attributeName());
    }

    // Object Start
    writeLine(writer, GdtConstants.TAG_OBJECT_START, object.objectId());

    // Elements (Fields and Nested Objects mixed)
    for (GdtElement element : object.elements()) {
      writeElement(writer, element);
    }

    // Object End
    writeLine(writer, GdtConstants.TAG_OBJECT_END, object.objectId());
  }

  /**
   * Writes a single line in GDT format.
   *
   * <p>Logic: Length = 3 (Length Field) + 4 (Tag) + Content Length + 2 (CRLF).
   */
  private void writeLine(Writer writer, String tag, String content) throws IOException {
    if (content == null) {
      content = "";
    }

    if (content.length() > MAX_CONTENT_LENGTH) {
      throw new IllegalArgumentException(
          "Content exceeds maximum length: " + content.length() + " > " + MAX_CONTENT_LENGTH);
    }

    int totalLength = LINE_METADATA_SIZE + content.length();
    String lengthStr = String.format("%03d", totalLength);
    String line = lengthStr + tag + content + GdtConstants.CRLF;
    writer.write(line);
  }
}
