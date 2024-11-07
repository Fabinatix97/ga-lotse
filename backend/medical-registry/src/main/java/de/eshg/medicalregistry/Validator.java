/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.file.common.FileType;
import de.eshg.file.common.FileTypeDetector;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public final class Validator {
  private Validator() {}

  public static void validateIsDraft(MedicalRegistryEntry procedure) {
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Procedure %s is not in draft status and therefore cannot be deleted."
              .formatted(procedure.getExternalId()));
    }
  }

  public static void validateFileType(MultipartFile multipartFile, FileType allowedFileType)
      throws IOException {
    FileType actualFileType = FileTypeDetector.getSupportedFileTypeOrThrow(multipartFile);
    if (actualFileType != allowedFileType) {
      throw new BadRequestException(
          ErrorCode.INVALID_FILE,
          String.format(
              "The file type of %s is not %s.", multipartFile.getName(), allowedFileType));
    }
  }
}
