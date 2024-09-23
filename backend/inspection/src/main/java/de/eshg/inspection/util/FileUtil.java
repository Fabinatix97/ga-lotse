/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import static de.eshg.lib.procedure.util.FileValidator.validate;
import static de.eshg.lib.procedure.util.FileValidator.validateAudioFile;

import de.base.rest.CustomMediaTypes;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.inspection.common.persistence.MediaFileContent;
import de.eshg.rest.service.error.BadRequestException;
import java.io.IOException;
import java.sql.Blob;
import java.util.Collection;
import java.util.List;
import org.hibernate.engine.jdbc.BlobProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public final class FileUtil {

  private FileUtil() {}

  private static final Logger log = LoggerFactory.getLogger(FileUtil.class);

  public static MediaFile readFileAndValidate(
      MultipartFile file, Collection<MediaType> allowedMediaTypes) {
    MediaType mediaType;
    if (allowedMediaTypes.containsAll(
        List.of(CustomMediaTypes.MEDIA_TYPE_MP3, CustomMediaTypes.MEDIA_TYPE_WAV))) {
      mediaType = validateAudioFile(file);
    } else {
      mediaType = validate(file);
    }
    if (!allowedMediaTypes.contains(mediaType)) {
      throw new BadRequestException("Unsupported media type: " + mediaType);
    }

    MediaFile mediaFile = new MediaFile();
    mediaFile.setMediaType(mediaType.toString());
    mediaFile.setFileName(file.getOriginalFilename());
    mediaFile.setFileSize(file.getSize());

    try {
      MediaFileContent mediaFileContent = new MediaFileContent();
      Blob fileContent = BlobProxy.generateProxy(file.getInputStream(), file.getSize());
      mediaFileContent.setFile(fileContent);
      mediaFile.setFileContent(mediaFileContent);
    } catch (final IOException e) {
      log.error("File content was corrupt", e);
      throw new BadRequestException("File content was corrupt");
    }
    return mediaFile;
  }
}
