/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.gdpr.persistence.GdprProcedure;
import de.eshg.base.gdpr.persistence.GdprProcedureStatus;
import de.eshg.base.gdpr.persistence.GdprProcedureType;
import de.eshg.base.gdpr.persistence.GdprProcedure_;
import de.eshg.base.gdpr.persistence.repository.GdprProcedureRepository;
import de.eshg.base.util.PaginationUtil;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class GdprProcedureService {
  private final GdprProcedureRepository repository;
  private final Clock clock;

  private static Specification<GdprProcedure> hasType(GdprProcedureType type) {
    if (type == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(GdprProcedure_.type), type);
  }

  public GdprProcedureService(GdprProcedureRepository repository, Clock clock) {
    this.repository = repository;
    this.clock = clock;
  }

  public GdprProcedure add(GdprProcedure procedure) {
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    Instant now = clock.instant();
    procedure.setCreatedAt(now);
    procedure.setModifiedAt(now);

    return repository.save(procedure);
  }

  public Optional<GdprProcedure> findByExternalId(UUID id) {
    return repository.findByExternalId(id);
  }

  public Page<GdprProcedure> findAll(
      GdprProcedureType gdprProcedureType, PaginationUtil.PageSpec pageSpec) {
    Specification<GdprProcedure> specification = Specification.allOf(hasType(gdprProcedureType));

    return repository.findAll(
        specification,
        PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize(), Sort.by(pageSpec.order())));
  }

  public GdprProcedure addCentralFileIdToGdprProcedure(
      UUID centralFileId, UUID gdprProcedureId, long version) {
    GdprProcedure storedGdprProcedure = getGdprProcedureForUpdate(gdprProcedureId);
    ValidationUtil.validateVersion(version, storedGdprProcedure);

    storedGdprProcedure.setCentralFileId(centralFileId);

    return getGdprProcedure(gdprProcedureId);
  }

  private GdprProcedure getGdprProcedure(UUID gdprProcedureId) {
    return repository.findByExternalId(gdprProcedureId).orElseThrow(notFound(gdprProcedureId));
  }

  private GdprProcedure getGdprProcedureForUpdate(UUID gdprProcedureId) {
    return repository
        .findByExternalIdForUpdate(gdprProcedureId)
        .orElseThrow(notFound(gdprProcedureId));
  }

  private static Supplier<NotFoundException> notFound(UUID id) {
    return () -> new NotFoundException("GdprProcedure with id '%s' not found.".formatted(id));
  }
}
