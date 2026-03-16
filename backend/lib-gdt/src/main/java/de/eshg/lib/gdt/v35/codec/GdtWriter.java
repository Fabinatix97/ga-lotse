/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.codec;

import de.eshg.lib.gdt.v35.model.Gdt35Element;
import de.eshg.lib.gdt.v35.model.Gdt35Field;
import de.eshg.lib.gdt.v35.model.Gdt35Object;
import de.eshg.lib.gdt.v35.model.Gdt35Record;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UncheckedIOException;
import java.io.Writer;
import java.util.List;

/**
 * Serializes {@link Gdt35Record} objects into a GDT data stream.
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
  public void write(List<Gdt35Record> records, OutputStream output) {
    try (Writer writer = new OutputStreamWriter(output, Gdt35Constants.CHARSET)) {
      for (Gdt35Record rec : records) {
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
  public void write(Gdt35Record record, OutputStream output) {
    write(List.of(record), output);
  }

  private void writeRecord(Writer writer, Gdt35Record rec) throws IOException {
    // Record Start
    writeLine(writer, Gdt35Constants.TAG_RECORD_START, rec.recordType());

    // Elements (Fields and Objects mixed)
    for (Gdt35Element element : rec.elements()) {
      writeElement(writer, element);
    }

    // Record End
    writeLine(writer, Gdt35Constants.TAG_RECORD_END, rec.recordType());
  }

  private void writeElement(Writer writer, Gdt35Element element) throws IOException {
    if (element instanceof Gdt35Field(String tag, String value)) {
      writeLine(writer, tag, value);
    } else if (element instanceof Gdt35Object object) {
      writeObject(writer, object);
    }
  }

  private void writeObject(Writer writer, Gdt35Object object) throws IOException {
    // Attribute Field (if tag exists)
    if (object.attributeTag() != null) {
      writeLine(writer, object.attributeTag(), object.attributeName());
    }

    // Object Start
    writeLine(writer, Gdt35Constants.TAG_OBJECT_START, object.objectId());

    // Elements (Fields and Nested Objects mixed)
    for (Gdt35Element element : object.elements()) {
      writeElement(writer, element);
    }

    // Object End
    writeLine(writer, Gdt35Constants.TAG_OBJECT_END, object.objectId());
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
    String line = lengthStr + tag + content + Gdt35Constants.CRLF;
    writer.write(line);
  }
}
