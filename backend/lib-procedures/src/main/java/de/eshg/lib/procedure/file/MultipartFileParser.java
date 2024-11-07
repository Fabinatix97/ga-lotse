/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import static de.eshg.lib.procedure.file.FileFactory.createImageWithMetaData;
import static de.eshg.lib.procedure.file.FileFactory.createPdfWithMetaData;

import de.eshg.file.common.FileTypeDetector;
import de.eshg.file.common.PdfAConformanceValidator;
import de.eshg.lib.procedure.domain.model.*;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

public final class MultipartFileParser {

  private MultipartFileParser() {}

  public static File parseFile(MultipartFile file) throws IOException {
    if (file == null) {
      return null;
    }

    ProcedureFileType fileType = parseProcedureFileType(file);
    return switch (fileType) {
      case JPEG, PNG -> parseImage(fileType, file);
      case PDF -> parsePdf(file);
      case EML -> parseEmail(file);
    };
  }

  public static ProcedureFileType parseProcedureFileType(MultipartFile file) throws IOException {
    return FileTypeMapper.mapToProcedureFileType(
        FileTypeDetector.getSupportedFileTypeOrThrow(file.getBytes()));
  }

  public static void validateProgressEntryTypeSupportsFileType(
      FileAware fileAware, MultipartFile multipartFile) throws IOException {
    ProcedureFileType fileType = parseProcedureFileType(multipartFile);
    if (!fileAware.supportsUpload(fileType)) {
      throw new BadRequestException(
          "File upload not supported for file type `%s`.".formatted(fileType));
    }
  }

  public static void validateProgressEntryTypeSupportsFileType(
      FileAware fileAware, ProcedureFileType fileType) {
    if (!fileAware.supportsUpload(fileType)) {
      throw new BadRequestException(
          "File upload not supported for file type `%s`.".formatted(fileType));
    }
  }

  private static Image parseImage(ProcedureFileType fileType, MultipartFile file)
      throws IOException {
    byte[] fileContent = file.getBytes();
    String fileName = FileExtensionEnricher.enrich(file.getOriginalFilename(), fileType);

    ImageMetaData imageMetaData = ImageMetaDataExtractor.fromFileContent(fileContent);
    return createImageWithMetaData(fileName, fileType, fileContent, imageMetaData);
  }

  private static Pdf parsePdf(MultipartFile file) throws IOException {
    byte[] fileContent = file.getBytes();
    String fileName =
        FileExtensionEnricher.enrich(file.getOriginalFilename(), ProcedureFileType.PDF);

    PdfAConformanceValidator.validate(fileContent);

    PdfMetaData pdfMetaData = PdfMetaDataExtractor.fromFileContent(fileContent);
    return createPdfWithMetaData(fileName, fileContent, pdfMetaData);
  }

  private static Mail parseEmail(MultipartFile file) throws IOException {
    byte[] fileContent = file.getBytes();
    String fileName =
        FileExtensionEnricher.enrich(file.getOriginalFilename(), ProcedureFileType.EML);

    Mail mail = EmlParser.parse(fileContent);
    mail.setFileName(fileName);
    return mail;
  }

  private static String getDescriptionOrElseNull(FileMetaDataDto fileMetaData) {
    return Optional.ofNullable(fileMetaData).map(FileMetaDataDto::getDescription).orElse(null);
  }
}
