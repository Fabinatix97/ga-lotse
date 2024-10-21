/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileContent;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.Mail;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;

public class FileFactory {

  private FileFactory() {}

  public static Image createImageWithMetaData(
      String fileName,
      ProcedureFileType fileType,
      byte[] content,
      ImageMetaData imageMetaData,
      boolean deletable) {
    Image image = new Image();
    image.addMetaData(imageMetaData);
    setFileProperties(image, fileName, fileType, content, deletable);
    return image;
  }

  public static Pdf createPdfWithMetaData(
      String fileName,
      ProcedureFileType fileType,
      byte[] content,
      PdfMetaData pdfMetaData,
      boolean deletable) {
    Pdf pdf = new Pdf();
    pdf.addMetaData(pdfMetaData);
    setFileProperties(pdf, fileName, fileType, content, deletable);
    return pdf;
  }

  static Mail fromParsedMail(String fileName, ParsedMail parsedMail) {
    Mail mail = new Mail();
    mail.addMetaData(parsedMail.getMetaData());
    setFileProperties(
        mail,
        fileName,
        parsedMail.getFileType(),
        parsedMail.getContent(),
        parsedMail.isDeletable());

    for (File attachment : parsedMail.getAttachments()) {
      mail.addAttachment(attachment);
    }

    mail.setRemovedInvalidAttachments(parsedMail.getRemovedInvalidAttachments());
    return mail;
  }

  private static void setFileProperties(
      File file, String fileName, ProcedureFileType fileType, byte[] content, boolean deletable) {
    FileContent fileContent = new FileContent();
    fileContent.setContent(content);

    file.setFileContent(fileContent);
    file.setFileName(fileName);
    file.setFileType(fileType);
    file.setFileSizeBytes(content.length);
    file.setDeletable(deletable);
  }
}
