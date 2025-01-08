/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.common.persistence;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;
import java.io.Serial;
import java.util.function.BiConsumer;
import java.util.function.Function;

public class MediaFileContentSerializer extends StdSerializer<MediaFileContent> {

  @Serial private static final long serialVersionUID = 1L;

  private final transient BiConsumer<String, byte[]> fileContentConsumer;
  private final transient Function<String, String> collisionFreeFileNameCreation;

  public MediaFileContentSerializer(
      BiConsumer<String, byte[]> fileContentConsumer,
      Function<String, String> collisionFreeFileNameCreation) {
    super(MediaFileContent.class);
    this.fileContentConsumer = fileContentConsumer;
    this.collisionFreeFileNameCreation = collisionFreeFileNameCreation;
  }

  /**
   * Replace the actual base64 encoded content by a collision free fileName that is referenced by
   * the name of the actual file inside the zip file
   *
   * <p>fileContentConsumer is responsible for adding an entry (representing the file) to the zip
   * file
   *
   * @param fileContent Value to serialize; can <b>not</b> be null.
   * @param gen Generator used to output resulting Json content
   * @param provider Provider that can be used to get serializers for serializing Objects value
   *     contains, if any.
   * @throws IOException
   */
  @Override
  public void serialize(
      MediaFileContent fileContent, JsonGenerator gen, SerializerProvider provider)
      throws IOException {
    String filename =
        fileContent.getMediaFiles().stream()
            .map(MediaFile::getFileName)
            .findFirst()
            .orElse("media");
    String collisionFreeFileName = collisionFreeFileNameCreation.apply(filename);

    fileContentConsumer.accept(collisionFreeFileName, fileContent.getAllBytes());
    gen.writeStartObject();
    gen.writeStringField("content", collisionFreeFileName);
    gen.writeEndObject();
  }
}
