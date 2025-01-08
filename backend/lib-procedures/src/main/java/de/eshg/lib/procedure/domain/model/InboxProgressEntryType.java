/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

public enum InboxProgressEntryType {
  LETTER(FileTypeGroup.DOCUMENT),
  PHONE_CALL(null),
  EMAIL(FileTypeGroup.EMAIL);

  private final FileTypeGroup fileTypeGroup;

  InboxProgressEntryType(FileTypeGroup fileTypeGroup) {
    this.fileTypeGroup = fileTypeGroup;
  }

  boolean supports(ProcedureFileType fileType) {
    if (fileTypeGroup == null) {
      return false;
    }

    return fileTypeGroup.getFileTypes().contains(fileType);
  }

  public static InboxProgressEntryType fromValueGracefully(String name) {
    try {
      return valueOf(name);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }
}
