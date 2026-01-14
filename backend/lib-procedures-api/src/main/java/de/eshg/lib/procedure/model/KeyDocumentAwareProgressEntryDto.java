/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.model.HasResolvableUserIds;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "KeyDocumentAwareProgressEntry")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public sealed interface KeyDocumentAwareProgressEntryDto extends HasResolvableUserIds
    permits ManualProgressEntryDto, SystemProgressEntryDto {

  String getKeyDocumentType();

  Integer getKeyDocumentVersion();
}
