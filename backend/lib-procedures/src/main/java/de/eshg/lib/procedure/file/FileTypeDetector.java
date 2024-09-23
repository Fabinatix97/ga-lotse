/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.FileType;
import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import java.io.InputStream;
import org.apache.tika.Tika;

public class FileTypeDetector {

  private FileTypeDetector() {}

  static String detect(byte[] fileContent) {
    return new Tika().detect(fileContent);
  }

  public static FileType getSupportedFileTypeOrThrow(InputStream fileInputStream)
      throws IOException {
    String contentType = new Tika().detect(fileInputStream);
    return getFileType(contentType);
  }

  static FileType getSupportedFileTypeOrThrow(byte[] fileContent) {
    String contentType = new Tika().detect(fileContent);
    return getFileType(contentType);
  }

  private static FileType getFileType(String contentType) {
    FileType fileType = FileType.fromContentType(contentType);

    if (fileType == null) {
      throw new BadRequestException("Unsupported file type: %s".formatted(contentType));
    }

    return fileType;
  }
}
