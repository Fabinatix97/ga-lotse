/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.iptc.IptcDirectory;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class ImageMetaDataExtractor {

  private static final Logger log = LoggerFactory.getLogger(ImageMetaDataExtractor.class);

  private ImageMetaDataExtractor() {}

  static ImageMetaData fromFileContent(byte[] file) {
    Metadata metadata = readImageMetaData(file);

    Instant createdDate =
        getExifDateOriginal(metadata).or(() -> getIptcDateCreated(metadata)).orElse(null);

    ImageMetaData imageMetaData = new ImageMetaData();
    imageMetaData.setCreatedDate(createdDate);
    return imageMetaData;
  }

  private static Metadata readImageMetaData(byte[] file) {
    try (ByteArrayInputStream bais = new ByteArrayInputStream(file)) {
      return ImageMetadataReader.readMetadata(bais);

    } catch (ImageProcessingException | IOException e) {
      log.error("Could not extract image meta data.");
      return new Metadata();
    }
  }

  private static Optional<Instant> getExifDateOriginal(Metadata metadata) {
    return Optional.ofNullable(metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class))
        .map(ExifSubIFDDirectory::getDateOriginal)
        .map(Date::toInstant);
  }

  private static Optional<Instant> getIptcDateCreated(Metadata metadata) {
    return Optional.ofNullable(metadata.getFirstDirectoryOfType(IptcDirectory.class))
        .map(IptcDirectory::getDateCreated)
        .map(Date::toInstant);
  }
}
