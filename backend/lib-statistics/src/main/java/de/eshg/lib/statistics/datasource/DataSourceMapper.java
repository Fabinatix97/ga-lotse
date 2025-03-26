/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.datasource;

import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataSourceInfo;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import java.util.List;

public class DataSourceMapper {
  private DataSourceMapper() {}

  public static DataSourceInfo mapToDataSourceInfo(DataSource<?> dataSource) {
    return new DataSourceInfo(
        dataSource.getId(),
        dataSource.getName(),
        dataSource.getSensitivity(),
        getAttributes(dataSource));
  }

  private static List<Attribute> getAttributes(DataSource<?> dataSource) {
    return dataSource.getAttributes().stream()
        .map(AttributeInfo::getAttributeData)
        .map(DataSourceMapper::mapToAttribute)
        .toList();
  }

  public static Attribute mapToAttribute(AttributeData attribute) {
    return new Attribute(
        attribute.getName(),
        attribute.getCode(),
        attribute.getValueType(),
        attribute.getUnit(),
        attribute.getValueOptions(),
        attribute.getCategory(),
        attribute.isMandatory(),
        attribute.getDataPrivacyCategory(),
        attribute.getIntervalConfiguration(),
        attribute.getLDiversity(),
        attribute.getTCloseness(),
        attribute.getTClosenessHierarchyEntries());
  }
}
