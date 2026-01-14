/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.file.common.FileType;

public enum ProcedureFileType {
  JPEG(FileType.JPEG),
  PNG(FileType.PNG),
  PDF(FileType.PDF),
  EML(FileType.EML);

  private final FileType fileType;

  ProcedureFileType(FileType fileType) {
    this.fileType = fileType;
  }

  public FileType getCommonFileType() {
    return fileType;
  }
}
