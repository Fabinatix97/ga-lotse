/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = PdfMetaDataHistoryDto.SCHEMA_NAME)
@JsonTypeName(PdfMetaDataHistoryDto.SCHEMA_NAME)
public final class PdfMetaDataHistoryDto extends MetaDataHistoryDto {

  public static final String SCHEMA_NAME = "PdfMetaDataHistory";

  @Valid private PdfMetaDataDto pdfMetaData;

  public PdfMetaDataDto getPdfMetaData() {
    return pdfMetaData;
  }

  public void setPdfMetaData(PdfMetaDataDto pdfMetaData) {
    this.pdfMetaData = pdfMetaData;
  }
}
