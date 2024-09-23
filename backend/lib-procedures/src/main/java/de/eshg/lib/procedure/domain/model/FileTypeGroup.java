/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.procedure.domain.model.FileType.EML;
import static de.eshg.lib.procedure.domain.model.FileType.JPEG;
import static de.eshg.lib.procedure.domain.model.FileType.PDF;
import static de.eshg.lib.procedure.domain.model.FileType.PNG;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;

public enum FileTypeGroup {
  DOCUMENT(PDF),
  EMAIL(EML),
  IMAGE(JPEG, PNG);

  private final EnumSet<FileType> fileTypes;

  FileTypeGroup(FileType... fileTypes) {
    this.fileTypes = EnumSet.copyOf(Arrays.asList(fileTypes));
  }

  public Set<FileType> getFileTypes() {
    return fileTypes;
  }
}
