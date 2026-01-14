/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.otherservicetemplate;

import de.eshg.travelmedicine.otherservicetemplate.api.OtherServiceTemplateDto;
import de.eshg.travelmedicine.otherservicetemplate.persistence.entity.OtherServiceTemplate;

public class OtherServiceTemplateMapper {

  private OtherServiceTemplateMapper() {}

  public static OtherServiceTemplateDto toInterfaceType(OtherServiceTemplate otherServiceTemplate) {
    if (otherServiceTemplate == null) {
      return null;
    }

    return new OtherServiceTemplateDto(
        otherServiceTemplate.getId(),
        otherServiceTemplate.getDescription(),
        otherServiceTemplate.getFee(),
        otherServiceTemplate.getCreatedAt(),
        otherServiceTemplate.getModifiedAt());
  }

  public static OtherServiceTemplate toDomainType(OtherServiceTemplateDto otherServiceTemplateDto) {
    if (otherServiceTemplateDto == null) {
      return null;
    }

    return new OtherServiceTemplate(
        otherServiceTemplateDto.id(),
        otherServiceTemplateDto.description(),
        otherServiceTemplateDto.fee());
  }
}
