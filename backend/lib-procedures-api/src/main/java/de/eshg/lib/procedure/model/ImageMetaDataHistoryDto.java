/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = ImageMetaDataHistoryDto.SCHEMA_NAME)
@JsonTypeName(ImageMetaDataHistoryDto.SCHEMA_NAME)
public final class ImageMetaDataHistoryDto extends MetaDataHistoryDto {
  public static final String SCHEMA_NAME = "ImageMetaDataHistory";

  @Valid private ImageMetaDataDto imageMetaData;

  public ImageMetaDataDto getImageMetaData() {
    return imageMetaData;
  }

  public void setImageMetaData(ImageMetaDataDto imageMetaData) {
    this.imageMetaData = imageMetaData;
  }
}
