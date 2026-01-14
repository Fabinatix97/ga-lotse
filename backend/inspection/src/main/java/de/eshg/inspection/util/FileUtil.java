/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import static de.eshg.file.common.FileValidator.validate;
import static de.eshg.file.common.FileValidator.validateAudioFile;

import de.eshg.file.common.CustomMediaTypes;
import de.eshg.file.common.ImageRewriter;
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
      MultipartFile file, Collection<MediaType> allowedMediaTypes, long maxImageSize) {
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
      Blob fileContent;
      if (mediaType.getType().equalsIgnoreCase("IMAGE")) {
        byte[] rewrittenFile =
            ImageRewriter.validateAndRewriteImageFile(file, mediaType, maxImageSize);
        fileContent = BlobProxy.generateProxy(rewrittenFile);
        mediaFile.setFileSize(rewrittenFile.length);
      } else {
        fileContent = BlobProxy.generateProxy(file.getInputStream(), file.getSize());
      }
      mediaFileContent.setFile(fileContent);
      mediaFile.setFileContent(mediaFileContent);
    } catch (final IOException e) {
      log.error("File content was corrupt", e);
      throw new BadRequestException("File content was corrupt");
    }
    return mediaFile;
  }
}
