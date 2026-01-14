/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = PdfDto.SCHEMA_NAME)
@JsonTypeName(PdfDto.SCHEMA_NAME)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public final class PdfDto extends AbstractFileDto {

  public static final String SCHEMA_NAME = "Pdf";

  private @Valid PdfMetaDataDto metaData;

  public PdfMetaDataDto getMetaData() {
    return metaData;
  }

  public void setMetaData(PdfMetaDataDto metaData) {
    this.metaData = metaData;
  }
}
