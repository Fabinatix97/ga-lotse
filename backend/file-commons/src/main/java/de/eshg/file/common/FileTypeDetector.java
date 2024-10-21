/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import java.io.InputStream;
import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

public class FileTypeDetector {

  private FileTypeDetector() {}

  public static String detect(byte[] fileContent) {
    return new Tika().detect(fileContent);
  }

  public static FileType getSupportedFileTypeOrThrow(MultipartFile file) throws IOException {
    String contentType = new Tika().detect(file.getBytes(), file.getOriginalFilename());
    return getFileType(contentType);
  }

  public static FileType getSupportedFileTypeOrThrow(InputStream fileInputStream)
      throws IOException {
    String contentType = new Tika().detect(fileInputStream);
    return getFileType(contentType);
  }

  public static FileType getSupportedFileTypeOrThrow(byte[] fileContent) {
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
