/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.http.MediaType;

public enum FileType {
  JPEG(
      MediaType.IMAGE_JPEG,
      FileExtension.JPG,
      FileExtension.JPEG,
      FileExtension.JPE,
      FileExtension.JFIF),
  PNG(MediaType.IMAGE_PNG, FileExtension.PNG),
  PDF(MediaType.APPLICATION_PDF, FileExtension.PDF),
  EML(CustomMediaTypes.EML, FileExtension.EML),
  CSV(CustomMediaTypes.CSV, FileExtension.CSV);

  private final MediaType mediaType;
  private final FileExtension defaultFileExtension;
  private final FileExtension[] alternativeExtension;

  FileType(
      MediaType mediaType,
      FileExtension defaultFileExtension,
      FileExtension... alternativeExtension) {
    this.mediaType = mediaType;
    this.defaultFileExtension = defaultFileExtension;
    this.alternativeExtension = alternativeExtension;
  }

  public static FileType fromContentType(String contentType) {
    for (FileType fileType : FileType.values()) {
      if (fileType.getMediaType().toString().equals(contentType)) {
        return fileType;
      }
    }

    return null;
  }

  public MediaType getMediaType() {
    return mediaType;
  }

  public FileExtension getDefaultFileExtension() {
    return defaultFileExtension;
  }

  public Set<FileExtension> getValidFileExtensions() {
    return Stream.concat(Stream.of(defaultFileExtension), Stream.of(alternativeExtension))
        .collect(Collectors.toSet());
  }

  public boolean hasValidFileExtension(String fileExtension) {
    return getValidFileExtensions().stream()
        .map(FileExtension::getValue)
        .anyMatch(fileExtension::equalsIgnoreCase);
  }
}
