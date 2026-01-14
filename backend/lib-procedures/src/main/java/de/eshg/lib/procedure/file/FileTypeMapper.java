/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.file.common.FileType;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.rest.service.error.BadRequestException;

public final class FileTypeMapper {
  private FileTypeMapper() {}

  public static ProcedureFileType mapToProcedureFileType(FileType fileType) {
    return switch (fileType) {
      case JPEG -> ProcedureFileType.JPEG;
      case PNG -> ProcedureFileType.PNG;
      case PDF -> ProcedureFileType.PDF;
      case EML -> ProcedureFileType.EML;
      default -> throw new BadRequestException("File type is not supported");
    };
  }
}
