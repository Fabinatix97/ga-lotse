/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(name = ImageMetaDataDto.SCHEMA_NAME)
@JsonTypeName(ImageMetaDataDto.SCHEMA_NAME)
public final class ImageMetaDataDto extends MetaDataDto {

  public static final String SCHEMA_NAME = "ImageMetaData";

  private Instant createdDate;

  public Instant getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Instant createdDate) {
    this.createdDate = createdDate;
  }
}
