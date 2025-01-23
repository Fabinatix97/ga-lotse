/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import static de.eshg.lib.procedure.file.FileFactory.createImageWithMetaData;
import static de.eshg.lib.procedure.file.FileFactory.createPdfWithMetaData;

import de.eshg.file.common.FileTypeDetector;
import de.eshg.file.common.FileValidator;
import de.eshg.file.common.ImageRewriter;
import de.eshg.file.common.PdfAConformanceValidator;
import de.eshg.lib.procedure.domain.model.*;
import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public final class MultipartFileParser {
  private MultipartFileParser() {}

  public static File validateAndParseFile(MultipartFile file, int maxImageSideLength)
      throws IOException {
    if (file == null) {
      return null;
    }
    FileValidator.validate(file);
    ProcedureFileType fileType = parseProcedureFileType(file);
    return switch (fileType) {
      case JPEG, PNG -> parseImage(fileType, file, maxImageSideLength);
      case PDF -> parsePdf(file);
      case EML -> parseEmail(file, maxImageSideLength);
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

  private static Image parseImage(
      ProcedureFileType fileType, MultipartFile file, int maxImageSideLength) throws IOException {
    byte[] fileContent =
        ImageRewriter.validateAndRewriteImageFile(
            file, fileType.getCommonFileType().getMediaType(), maxImageSideLength);
    ImageMetaData imageMetaData = ImageMetaDataExtractor.fromFileContent(fileContent);
    return createImageWithMetaData(
        file.getOriginalFilename(), fileType, fileContent, imageMetaData);
  }

  private static Pdf parsePdf(MultipartFile file) throws IOException {
    byte[] fileContent = file.getBytes();
    PdfAConformanceValidator.validate(fileContent);
    PdfMetaData pdfMetaData = PdfMetaDataExtractor.fromFileContent(fileContent);
    return createPdfWithMetaData(file.getOriginalFilename(), fileContent, pdfMetaData);
  }

  private static Mail parseEmail(MultipartFile file, int maxImageSideLength) throws IOException {
    byte[] fileContent = file.getBytes();
    Mail mail = EmlParser.parse(fileContent, maxImageSideLength);
    mail.setFileName(file.getOriginalFilename());
    return mail;
  }
}
