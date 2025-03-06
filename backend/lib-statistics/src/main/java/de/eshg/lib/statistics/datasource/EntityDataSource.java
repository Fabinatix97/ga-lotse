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
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatistics;
import de.eshg.lib.statistics.util.DataRowPage;
import de.eshg.lib.statistics.util.TimeRange;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

public abstract class EntityDataSource<E extends GenericEntity<?>, A extends AttributeInfo>
    extends DataSource<A> {
  protected EntityDataSource(
      UUID id, String name, DataSourceSensitivity sensitivity, A[] attributes) {
    super(id, name, sensitivity, attributes);
  }

  @Override
  public DataRowPage getDataRowPage(
      List<A> requestedAttributeInfos,
      DataTableHeader dataTableHeader,
      TimeRange timeRange,
      int page,
      int pageSize,
      List<ProcedureReferenceForStatistics> procedureReferences) {
    Page<DataRow> dataRows =
        retrieveEntities(timeRange, page, pageSize)
            .map(
                entity ->
                    createDataRow(entity, requestedAttributeInfos, timeRange, procedureReferences));

    return new DataRowPage(dataRows.getContent(), dataRows.getTotalElements());
  }

  private DataRow createDataRow(
      E entity,
      List<A> requestedAttributeInfos,
      TimeRange timeRange,
      List<ProcedureReferenceForStatistics> procedureReferences) {
    List<Object> values =
        requestedAttributeInfos.stream()
            .map(
                attribute -> {
                  Object value = mapSpecificValue(entity, attribute, timeRange);
                  if (attribute.getAttributeData() instanceof ProcedureAttribute) {
                    return createProcedureReference(value, procedureReferences);
                  } else {
                    return value;
                  }
                })
            .toList();
    return new DataRow(values);
  }

  private static Object createProcedureReference(
      Object value, List<ProcedureReferenceForStatistics> procedureReferences) {
    if (value instanceof UUID procedureId) {
      ProcedureReferenceForStatistics reference = new ProcedureReferenceForStatistics();
      reference.setProcedureId(procedureId);
      procedureReferences.add(reference);
      return reference.getExternalId();
    } else {
      return null;
    }
  }

  protected abstract Page<E> retrieveEntities(TimeRange timeRange, int page, int pageSize);

  protected abstract Object mapSpecificValue(E entity, A attribute, TimeRange timeRange);
}
