/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.error.NotFoundException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure_;
import jakarta.persistence.criteria.Predicate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class StiProtectionProcedureFinder {
  private final StiProtectionProcedureRepository procedureRepository;

  public StiProtectionProcedureFinder(StiProtectionProcedureRepository procedureRepository) {
    this.procedureRepository = procedureRepository;
  }

  public StiProtectionProcedure findByExternalId(UUID procedureId) {
    return procedureRepository
        .findByExternalId(procedureId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with given UUID not found"
                        .formatted(StiProtectionProcedure.class.getSimpleName())));
  }

  public List<StiProtectionProcedure> findProcedures(String text) {
    if (!StringUtils.hasText(text)) {
      return List.of();
    }

    Specification<StiProtectionProcedure> spec =
        (root, query, cb) -> {
          String escapedSearchTerm = escapeWildcard(text) + "%";
          Predicate accessCodeLike =
              cb.like(root.get(StiProtectionProcedure_.ACCESS_CODE), escapedSearchTerm, '\\');
          Predicate sampleBarCodeLike =
              cb.like(root.get(StiProtectionProcedure_.SAMPLE_BAR_CODE), escapedSearchTerm, '\\');
          return cb.or(accessCodeLike, sampleBarCodeLike);
        };
    return procedureRepository.findAll(spec);
  }

  private static String escapeWildcard(String text) {
    return text.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
  }
}
