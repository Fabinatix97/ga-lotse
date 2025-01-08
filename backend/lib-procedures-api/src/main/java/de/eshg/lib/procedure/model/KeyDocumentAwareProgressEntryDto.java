/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "KeyDocumentAwareProgressEntry")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public sealed interface KeyDocumentAwareProgressEntryDto
    permits ManualProgressEntryDto, SystemProgressEntryDto {

  String getKeyDocumentType();

  Integer getKeyDocumentVersion();
}
