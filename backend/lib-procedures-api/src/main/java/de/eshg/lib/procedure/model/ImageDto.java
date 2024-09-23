/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = ImageDto.SCHEMA_NAME)
@JsonTypeName(ImageDto.SCHEMA_NAME)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public final class ImageDto extends ConcreteFileDto {

  public static final String SCHEMA_NAME = "Image";

  private @Valid ImageMetaDataDto metaData;

  public ImageMetaDataDto getMetaData() {
    return metaData;
  }

  public void setMetaData(ImageMetaDataDto metaData) {
    this.metaData = metaData;
  }
}
