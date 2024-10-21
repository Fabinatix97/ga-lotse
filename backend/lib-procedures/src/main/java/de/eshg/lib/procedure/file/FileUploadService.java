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
import java.io.IOException;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

  private final FileUploadValidator fileUploadValidator;
  private final FileStorageService fileStorageService;

  public FileUploadService(
      FileUploadValidator fileUploadValidator, FileStorageService fileStorageService) {
    this.fileUploadValidator = fileUploadValidator;
    this.fileStorageService = fileStorageService;
  }

  public void handleFile(FileAware fileAware, MultipartFile file, FileMetaDataDto fileMetaData)
      throws IOException {
    ProcedureFileType fileType =
        FileTypeMapper.mapToProcedureFileType(
            FileTypeDetector.getSupportedFileTypeOrThrow(file.getBytes()));
    fileUploadValidator.validateFileAwareSupportsFileUpload(fileAware, fileType);

    switch (fileType) {
      case JPEG, PNG -> handleImage(fileAware, fileType, file, fileMetaData);
      case PDF -> handlePdf(fileAware, fileType, file, fileMetaData);
      case EML -> handleMailEml(fileAware, fileType, file, fileMetaData);
    }
  }

  private void handleImage(
      FileAware fileAware,
      ProcedureFileType fileType,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    byte[] fileContent = file.getBytes();
    String fileName = FileExtensionEnricher.enrich(file.getOriginalFilename(), fileType);

    ImageMetaData imageMetaData = new ImageMetaData();
    ImageMetaDataExtractor.extract(fileContent, imageMetaData);
    imageMetaData.setDescription(getDescriptionOrElseNull(fileMetaData));

    Image image =
        createImageWithMetaData(
            fileName, fileType, fileContent, imageMetaData, isFileDeletable(fileAware));

    fileStorageService.persistFile(image, fileAware);
  }

  private void handlePdf(
      FileAware fileAware,
      ProcedureFileType fileType,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    byte[] fileContent = file.getBytes();
    String fileName = FileExtensionEnricher.enrich(file.getOriginalFilename(), fileType);

    PdfAConformanceValidator.validate(fileContent);

    PdfMetaData pdfMetaData = new PdfMetaData();
    PdfMetaDataExtractor.extract(fileContent, pdfMetaData);
    pdfMetaData.setDescription(getDescriptionOrElseNull(fileMetaData));

    Pdf pdf =
        createPdfWithMetaData(
            fileName, fileType, fileContent, pdfMetaData, isFileDeletable(fileAware));

    fileStorageService.persistFile(pdf, fileAware);
  }

  private void handleMailEml(
      FileAware fileAware,
      ProcedureFileType fileType,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    byte[] fileContent = file.getBytes();
    String fileName = FileExtensionEnricher.enrich(file.getOriginalFilename(), fileType);

    ParsedMail parsedMail = EmlParser.parse(fileContent, isFileDeletable(fileAware));

    Mail mail = FileFactory.fromParsedMail(fileName, parsedMail);
    String subject = parsedMail.getSubject();
    String messageText = parsedMail.getMessageText();

    MailMetaData mailMetaData = mail.getMetaData();
    mailMetaData.setDescription(getDescriptionOrElseNull(fileMetaData));

    fileStorageService.persistFileAndUpdateProgressEntry(mail, subject, messageText, fileAware);
  }

  private boolean isFileDeletable(FileAware fileAware) {
    return fileAware instanceof ManualProgressEntry;
  }

  private String getDescriptionOrElseNull(FileMetaDataDto fileMetaData) {
    return Optional.ofNullable(fileMetaData).map(FileMetaDataDto::getDescription).orElse(null);
  }
}
