/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public class FileTypeDetector {

  private FileTypeDetector() {}

  public static String detect(byte[] fileContent) {
    return new TikaWrapper().detect(fileContent);
  }

  public static FileType getSupportedFileTypeOrThrow(MultipartFile file) throws IOException {
    String contentType = new TikaWrapper().detect(file.getInputStream());
    if (MediaType.TEXT_PLAIN_VALUE.equals(contentType)) {
      FileType fileType =
          getFileType(new TikaWrapper().detect(file.getInputStream(), file.getOriginalFilename()));
      if (isConsistentWithTextFile(fileType)) {
        return fileType;
      }
    }
    return getFileType(contentType);
  }

  public static FileType getSupportedFileTypeOrThrow(byte[] fileContent) {
    String contentType = new TikaWrapper().detect(fileContent);
    return getFileType(contentType);
  }

  private static FileType getFileType(String contentType) {
    FileType fileType = FileType.fromContentType(contentType);

    if (fileType == null) {
      throw new BadRequestException("Unsupported file type: %s".formatted(contentType));
    }

    return fileType;
  }

  private static boolean isConsistentWithTextFile(FileType fileType) {
    return (fileType == FileType.CSV) || (fileType == FileType.MD) || (fileType == FileType.YAML);
  }
}
