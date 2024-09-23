/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import static de.eshg.lib.procedure.domain.model.FileType.EML;

import de.eshg.lib.procedure.domain.model.FileAware;
import de.eshg.lib.procedure.domain.model.FileType;
import de.eshg.lib.procedure.domain.model.KeyDocumentType;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.repository.ManualProgressEntryRepository;
import de.eshg.rest.service.error.BadRequestException;
import java.util.Objects;

public class FileUploadValidator {

  private final ManualProgressEntryRepository manualProgressEntryRepository;

  public FileUploadValidator(ManualProgressEntryRepository manualProgressEntryRepository) {
    this.manualProgressEntryRepository = manualProgressEntryRepository;
  }

  void validateFileAwareSupportsFileUpload(FileAware fileAware, FileType fileType) {
    validateProgressEntryTypeSupportsFileType(fileAware, fileType);
    validateFileAwareSubjectAndMessageTextIsNull(fileAware, fileType);

    if (fileAware instanceof ManualProgressEntry manualProgressEntry) {
      validateKeyDocumentsUniformFileTypes(manualProgressEntry, fileType);
    }
  }

  private void validateProgressEntryTypeSupportsFileType(FileAware fileAware, FileType fileType) {
    if (!fileAware.supportsUpload(fileType)) {
      throw new BadRequestException(
          "File upload not supported for file type `%s`.".formatted(fileType));
    }
  }

  private void validateFileAwareSubjectAndMessageTextIsNull(
      FileAware fileAware, FileType fileType) {
    if (EML.equals(fileType) && hasFileAwareSubjectOrMessageText(fileAware)) {
      throw new BadRequestException(
          "Subject and message text are parsed from eml and should not be given");
    }
  }

  private boolean hasFileAwareSubjectOrMessageText(FileAware fileAware) {
    return !Objects.isNull(fileAware.getSubject()) || !Objects.isNull(fileAware.getMessageText());
  }

  private void validateKeyDocumentsUniformFileTypes(
      ManualProgressEntry manualProgressEntry, FileType fileType) {
    KeyDocumentType keyDocumentType = manualProgressEntry.getKeyDocumentType();

    if (keyDocumentType == null) {
      return;
    }

    if (manualProgressEntryRepository.existsByProcedureIdAndKeyDocumentTypeAndFileFileTypeNot(
        manualProgressEntry.getProcedureId(), keyDocumentType, fileType)) {
      throw new BadRequestException(
          "Key document type `%s` does not support file type `%s`."
              .formatted(keyDocumentType, fileType));
    }
  }
}
