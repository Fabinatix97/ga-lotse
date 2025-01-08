/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(name = PdfMetaDataDto.SCHEMA_NAME)
@JsonTypeName(PdfMetaDataDto.SCHEMA_NAME)
public final class PdfMetaDataDto extends MetaDataDto {

  public static final String SCHEMA_NAME = "PdfMetaData";

  private Instant createdDate;

  public Instant getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Instant createdDate) {
    this.createdDate = createdDate;
  }
}
