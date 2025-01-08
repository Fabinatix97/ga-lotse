/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileContent;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.PdfMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;

public class FileFactory {

  private FileFactory() {}

  public static Image createImageWithMetaData(
      String fileName, ProcedureFileType fileType, byte[] content, ImageMetaData imageMetaData) {
    Image image = new Image();
    image.addMetaData(imageMetaData);
    setFileProperties(image, fileName, fileType, content);
    return image;
  }

  public static Pdf createPdfWithMetaData(
      String fileName, byte[] content, PdfMetaData pdfMetaData) {
    Pdf pdf = new Pdf();
    pdf.addMetaData(pdfMetaData);
    setFileProperties(pdf, fileName, ProcedureFileType.PDF, content);
    return pdf;
  }

  private static void setFileProperties(
      File file, String fileName, ProcedureFileType fileType, byte[] content) {
    FileContent fileContent = new FileContent();
    fileContent.setContent(content);

    file.setFileContent(fileContent);
    file.setFileName(fileName);
    file.setFileType(fileType);
    file.setFileSizeBytes(content.length);
  }
}
