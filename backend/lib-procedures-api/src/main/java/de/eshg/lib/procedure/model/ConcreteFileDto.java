/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import de.cronn.commons.lang.SetUtils;
import de.eshg.lib.foureyes.model.ApprovalRequestEntityDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;
import java.util.UUID;

@Schema(name = "ConcreteFileDto", allOf = AbstractFileDto.class)
@JsonTypeInfo(use = Id.NAME, property = "@type")
public abstract sealed class ConcreteFileDto extends AbstractFileDto
    implements ConcreteFileOrFileReference, ApprovalRequestEntityDto
    permits ImageDto, MailDto, PdfDto {

  @Override
  @JsonIgnore
  public Set<UUID> getResolvableUserIds() {
    UUID createdBy = getCreatedBy();
    if (createdBy == null) {
      return Set.of();
    }

    return SetUtils.orderedSet(createdBy);
  }
}
