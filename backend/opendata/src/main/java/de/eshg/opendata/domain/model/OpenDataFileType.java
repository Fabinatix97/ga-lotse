/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.model;

import de.eshg.file.common.FileType;

public enum OpenDataFileType {
  PDF(FileType.PDF),
  CSV(FileType.CSV);

  private final FileType fileType;

  OpenDataFileType(FileType fileType) {
    this.fileType = fileType;
  }

  public FileType getCommonFileType() {
    return fileType;
  }
}
