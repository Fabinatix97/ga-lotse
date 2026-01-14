/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = MailMetaDataHistoryDto.SCHEMA_NAME)
@JsonTypeName(MailMetaDataHistoryDto.SCHEMA_NAME)
public final class MailMetaDataHistoryDto extends MetaDataHistoryDto {
  public static final String SCHEMA_NAME = "MailMetaDataHistory";

  @Valid private MailMetaDataDto mailMetaData;

  public MailMetaDataDto getMailMetaData() {
    return mailMetaData;
  }

  public void setMailMetaData(MailMetaDataDto mailMetaData) {
    this.mailMetaData = mailMetaData;
  }
}
