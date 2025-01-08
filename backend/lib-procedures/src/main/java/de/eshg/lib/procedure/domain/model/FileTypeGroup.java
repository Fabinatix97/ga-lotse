/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.procedure.domain.model.ProcedureFileType.EML;
import static de.eshg.lib.procedure.domain.model.ProcedureFileType.JPEG;
import static de.eshg.lib.procedure.domain.model.ProcedureFileType.PDF;
import static de.eshg.lib.procedure.domain.model.ProcedureFileType.PNG;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;

public enum FileTypeGroup {
  DOCUMENT(PDF),
  EMAIL(EML),
  IMAGE(JPEG, PNG);

  private final EnumSet<ProcedureFileType> fileTypes;

  FileTypeGroup(ProcedureFileType... fileTypes) {
    this.fileTypes = EnumSet.copyOf(Arrays.asList(fileTypes));
  }

  public Set<ProcedureFileType> getFileTypes() {
    return fileTypes;
  }
}
