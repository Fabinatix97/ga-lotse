/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.datasource;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.util.DataRowPage;
import de.eshg.lib.statistics.util.TimeRange;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

public abstract class EntityDataSource<E extends GenericEntity<?>, A extends AttributeInfo>
    extends DataSource<A> {
  protected EntityDataSource(
      UUID id,
      String name,
      DataSourceSensitivity sensitivity,
      A[] attributes,
      boolean canBeAnonymized) {
    super(id, name, sensitivity, attributes, canBeAnonymized);
  }

  private DataRow createDataRow(E entity, List<A> requestedAttributeInfos, TimeRange timeRange) {
    List<Object> values =
        requestedAttributeInfos.stream()
            .map(attribute -> mapSpecificValue(entity, attribute, timeRange))
            .toList();
    return new DataRow(values);
  }

  @Override
  public DataRowPage getDataRowPage(
      List<A> requestedAttributeInfos,
      DataTableHeader dataTableHeader,
      TimeRange timeRange,
      int page,
      int pageSize) {
    Page<DataRow> dataRows =
        retrieveEntities(timeRange, page, pageSize)
            .map(entity -> createDataRow(entity, requestedAttributeInfos, timeRange));

    return new DataRowPage(dataRows.getContent(), dataRows.getTotalElements());
  }

  protected abstract Page<E> retrieveEntities(TimeRange timeRange, int page, int pageSize);

  protected abstract Object mapSpecificValue(E entity, A attribute, TimeRange timeRange);
}
