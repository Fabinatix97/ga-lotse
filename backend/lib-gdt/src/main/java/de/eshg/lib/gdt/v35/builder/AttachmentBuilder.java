/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.builder;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Builder for File Attachments (Obj_0010 / Obj_Anhang).
 *
 * <p>Used to transfer external files such as PDFs, JPEGs, or other documents by reference. The file
 * itself is not embedded but linked via a path.
 */
public class AttachmentBuilder extends BaseBuilder<AttachmentBuilder> {

  @Override
  protected AttachmentBuilder self() {
    return this;
  }

  /**
   * Sets the File Path (6305).
   *
   * <p>The full absolute path to the file on the shared file system. The receiver must have read
   * access to this location.
   *
   * @param value The file path (e.g., "C:\\GDT\\Exchange\\Report.pdf").
   * @return This builder instance.
   */
  public AttachmentBuilder filePath(String value) {
    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException("File path cannot be null or empty");
    }

    // Normalize path and check for traversal attempts
    Path normalizedPath = Paths.get(value).normalize();
    String normalized = normalizedPath.toString();

    // Block path traversal patterns
    if (normalized.contains("..")
        || normalized.startsWith("/etc")
        || normalized.startsWith("/sys")
        || normalized.matches("(?i)^[A-Z]:\\\\Windows\\\\System32.*")) {
      throw new SecurityException("Invalid file path: path traversal detected");
    }

    return addField("6305", normalized);
  }

  /**
   * Sets the File Format (6304).
   *
   * <p>A short string identifying the format (e.g., "PDF", "JPG", "TXT"). Helps the receiver
   * determine how to open or display the file.
   *
   * @param value The format identifier.
   * @return This builder instance.
   */
  public AttachmentBuilder format(String value) { // e.g. PDF, JPG
    return addField("6304", value);
  }

  /**
   * Sets the Description/Comment (6220).
   *
   * <p>A text description of the attachment's content (e.g., "Pulmonary Function Report").
   *
   * @param value The description text.
   * @return This builder instance.
   */
  public AttachmentBuilder description(String value) {
    return addField(
        "6220", value); // 6220 is "Dies ist ein zweizeiliger" comment in example, generic text line
  }
}
