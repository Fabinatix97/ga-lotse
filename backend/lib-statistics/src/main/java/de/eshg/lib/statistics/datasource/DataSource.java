/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.datasource;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.persistence.ProcedureReferenceForStatistics;
import de.eshg.lib.statistics.util.DataRowPage;
import de.eshg.lib.statistics.util.TemporalRange;
import de.eshg.lib.statistics.util.TimeRange;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.time.temporal.Temporal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public abstract class DataSource<A extends AttributeInfo> {

  private final UUID id;
  private final String name;
  private final DataSourceSensitivity sensitivity;
  private final Integer kAnonymity;
  private final List<A> attributes;

  protected DataSource(
      UUID id, String name, DataSourceSensitivity sensitivity, Integer kAnonymity, A[] attributes) {
    this.id = id;
    this.name = name;
    this.sensitivity = sensitivity;
    this.kAnonymity = kAnonymity;
    this.attributes = Arrays.asList(attributes);
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public DataSourceSensitivity getSensitivity() {
    return sensitivity;
  }

  public Integer getKAnonymity() {
    return kAnonymity;
  }

  public List<A> getAttributes() {
    return attributes;
  }

  public Optional<A> findAttribute(String attributeCode) {
    return getAttributes().stream()
        .filter(attribute -> attribute.getCode().equals(attributeCode))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  public abstract DataRowPage getDataRowPage(
      List<A> requestedAttributeInfos,
      DataTableHeader dataTableHeader,
      TimeRange timeRange,
      int page,
      int pageSize,
      List<ProcedureReferenceForStatistics> procedureReferences);

  protected <T extends Temporal & Comparable<? super T>> Predicate isInTimeRange(
      CriteriaBuilder criteriaBuilder, Expression<T> temporalPath, TemporalRange<T> range) {
    return criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(temporalPath, range.start()),
        criteriaBuilder.lessThan(temporalPath, range.end()));
  }

  protected <T extends Temporal & Comparable<? super T>> Predicate isInTimeRangeIfPresent(
      CriteriaBuilder criteriaBuilder, Expression<T> temporalPath, TemporalRange<T> range) {
    return criteriaBuilder.or(
        criteriaBuilder.isNull(temporalPath), isInTimeRange(criteriaBuilder, temporalPath, range));
  }
}
