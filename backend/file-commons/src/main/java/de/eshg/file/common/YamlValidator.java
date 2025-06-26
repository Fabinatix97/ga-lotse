/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import de.eshg.rest.service.error.BadRequestException;
import java.util.Set;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public class YamlValidator {
  private static final Set<MediaType> acceptedTypes =
      Set.of(
          MediaType.APPLICATION_OCTET_STREAM,
          MediaType.APPLICATION_YAML,
          CustomMediaTypes.APPLICATION_X_YAML,
          CustomMediaTypes.TEXT_YAML,
          CustomMediaTypes.TEXT_X_YAML);

  public static void validate(MultipartFile yamlFile) {
    FileValidator.validateYamlFile(yamlFile);
    String fileContentType = yamlFile.getContentType();
    if (fileContentType != null) {
      MediaType fileMediaType = MediaType.parseMediaType(fileContentType);
      validateFileType(fileMediaType);
    }
  }

  public static boolean isAcceptedMediaType(MediaType mediaType) {
    return acceptedTypes.contains(mediaType);
  }

  private static void validateFileType(MediaType mediaType) {
    if (!isAcceptedMediaType(mediaType)) {
      throw new BadRequestException("File media type not accepted: " + mediaType);
    }
  }
}
