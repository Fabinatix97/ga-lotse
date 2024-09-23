/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

public enum ManualProgressEntryType {
  LETTER(FileTypeGroup.DOCUMENT),
  PHONE_CALL(null),
  NOTE(null),
  EMAIL(FileTypeGroup.EMAIL),
  IMAGE(FileTypeGroup.IMAGE),
  DOCUMENT(FileTypeGroup.DOCUMENT);

  private final FileTypeGroup fileTypeGroup;

  ManualProgressEntryType(FileTypeGroup fileTypeGroup) {
    this.fileTypeGroup = fileTypeGroup;
  }

  public static ManualProgressEntryType fromValueGracefully(String name) {
    try {
      return valueOf(name);
    } catch (IllegalArgumentException e) {
      return null;
    }
  }

  boolean supports(FileType fileType) {
    if (fileTypeGroup == null) {
      return false;
    }

    return fileTypeGroup.getFileTypes().contains(fileType);
  }
}
