/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import java.util.Objects;
import java.util.UUID;

public class AttributeSelectionMapper {
  private AttributeSelectionMapper() {}

  static AttributeSelection mapToPersistence(AttributeSelectionDto attributeSelectionDto) {
    if (attributeSelectionDto == null) {
      return null;
    }
    AttributeSelection attributeSelection = new AttributeSelection();
    attributeSelection.setBusinessModuleName(attributeSelectionDto.businessModuleName());
    attributeSelection.setDataSourceId(attributeSelectionDto.dataSourceId());
    attributeSelection.setBusinessModuleAttributeCode(
        attributeSelectionDto.businessModuleAttributeCode());
    attributeSelection.setBaseModuleAttributeCode(attributeSelectionDto.baseModuleAttributeCode());

    attributeSelection.setSearchKey(
        buildSearchKey(
            attributeSelection.getBusinessModuleAttributeCode(),
            attributeSelection.getDataSourceId(),
            attributeSelection.getBusinessModuleName(),
            attributeSelection.getBaseModuleAttributeCode()));
    return attributeSelection;
  }

  public static String buildSearchKey(
      String businessModuleAttributeCode,
      UUID dataSourceId,
      String businessModuleName,
      String baseModulAttributeCode) {
    if (baseModulAttributeCode == null) {
      return "%s~%s~%s".formatted(businessModuleAttributeCode, dataSourceId, businessModuleName);
    } else {
      return "%s~%s~%s~%s"
          .formatted(
              businessModuleAttributeCode,
              dataSourceId,
              businessModuleName,
              baseModulAttributeCode);
    }
  }

  public static AttributeSelectionDto mapToApi(
      AttributeSelection attributeSelection, boolean mandatory) {
    if (mandatory) {
      Objects.requireNonNull(attributeSelection);
    }
    if (attributeSelection == null) {
      return null;
    }
    return new AttributeSelectionDto(
        attributeSelection.getBusinessModuleName(),
        attributeSelection.getDataSourceId(),
        attributeSelection.getBusinessModuleAttributeCode(),
        attributeSelection.getBaseModuleAttributeCode());
  }
}
