/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.datasource;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.util.TimeRange;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public abstract class ProcedureDataSource<P extends Procedure<P, ?, ?, ?>, A extends AttributeInfo>
    extends EntityDataSource<P, A> {

  private final ProcedureRepository<P> procedureRepository;

  protected ProcedureDataSource(
      UUID id,
      String name,
      DataSourceSensitivity sensitivity,
      Integer kAnonymity,
      ProcedureRepository<P> procedureRepository,
      A[] attributes) {
    super(id, name, sensitivity, kAnonymity, attributes);
    this.procedureRepository = procedureRepository;
  }

  @Override
  protected Page<P> retrieveEntities(TimeRange timeRange, int page, int pageSize) {
    return procedureRepository.findAll(
        getProcedureSpecification(timeRange),
        PageRequest.of(page, pageSize, Sort.by(Sort.Direction.ASC, BaseEntity_.ID)));
  }

  protected Specification<P> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) ->
        isInTimeRange(criteriaBuilder, root.get(Procedure_.createdAt), timeRange);
  }
}
