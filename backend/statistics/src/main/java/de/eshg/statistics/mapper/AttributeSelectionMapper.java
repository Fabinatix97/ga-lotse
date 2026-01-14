/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.TableColumn;
import java.util.Objects;
import java.util.UUID;

public class AttributeSelectionMapper {
  public static final String SEARCH_KEY_DELIMITER = "~";

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

    attributeSelection.setSearchKey(buildSearchKey(attributeSelection));
    return attributeSelection;
  }

  static String buildSearchKey(AttributeSelection attributeSelection) {
    return buildSearchKey(
        attributeSelection.getBusinessModuleAttributeCode(),
        attributeSelection.getDataSourceId(),
        attributeSelection.getBusinessModuleName(),
        attributeSelection.getBaseModuleAttributeCode());
  }

  public static String buildSearchKey(
      String businessModuleAttributeCode,
      UUID dataSourceId,
      String businessModuleName,
      String baseModuleAttributeCode) {
    if (baseModuleAttributeCode == null) {
      return java.lang.String.join(
          SEARCH_KEY_DELIMITER,
          businessModuleAttributeCode,
          dataSourceId.toString(),
          businessModuleName);
    } else {
      return java.lang.String.join(
          SEARCH_KEY_DELIMITER,
          businessModuleAttributeCode,
          dataSourceId.toString(),
          businessModuleName,
          baseModuleAttributeCode);
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

  public static AttributeSelectionDto mapToApi(TableColumn tableColumn) {
    if (tableColumn == null) {
      return null;
    } else {
      return new AttributeSelectionDto(
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getBusinessModuleAttributeCode(),
          tableColumn.getBaseModuleAttributeCode());
    }
  }
}
