/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = GenericFileDto.SCHEMA_NAME)
@JsonTypeName(GenericFileDto.SCHEMA_NAME)
@JsonTypeInfo(use = Id.NAME, property = "@type")
public final class GenericFileDto extends AbstractFileDto {

  public static final String SCHEMA_NAME = "GenericFile";
}
