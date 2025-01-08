/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = MailDto.SCHEMA_NAME)
@JsonTypeName(MailDto.SCHEMA_NAME)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public final class MailDto extends AbstractFileDto {

  public static final String SCHEMA_NAME = "Mail";

  private @Valid MailMetaDataDto metaData;

  private @NotNull int removedInvalidAttachments;

  public MailMetaDataDto getMetaData() {
    return metaData;
  }

  public void setMetaData(MailMetaDataDto metaData) {
    this.metaData = metaData;
  }

  public int getRemovedInvalidAttachments() {
    return removedInvalidAttachments;
  }

  public void setRemovedInvalidAttachments(int removedInvalidAttachments) {
    this.removedInvalidAttachments = removedInvalidAttachments;
  }
}
