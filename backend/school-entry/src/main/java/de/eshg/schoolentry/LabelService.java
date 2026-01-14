/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.population.CreateLabelsTask.INFORMATION_BLOCK_LABEL_NAME;
import static de.eshg.schoolentry.population.CreateLabelsTask.SPECIAL_NEEDS_LABEL_NAME;

import de.eshg.schoolentry.domain.model.ProcedureLabel;
import de.eshg.schoolentry.domain.repository.ProcedureLabelRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class LabelService {
  private final ProcedureLabelRepository procedureLabelRepository;
  private final Map<String, Long> cachedLabelIds = new ConcurrentHashMap<>();

  public LabelService(ProcedureLabelRepository procedureLabelRepository) {
    this.procedureLabelRepository = procedureLabelRepository;
  }

  public ProcedureLabel getSpecialNeedsLabel() {
    return findSystemLabelOrThrow(SPECIAL_NEEDS_LABEL_NAME);
  }

  public ProcedureLabel getInformationBlockLabel() {
    return findSystemLabelOrThrow(INFORMATION_BLOCK_LABEL_NAME);
  }

  private ProcedureLabel findSystemLabelOrThrow(String name) {
    Long labelId = cachedLabelIds.computeIfAbsent(name, this::findLabelIdByNameUncached);
    return procedureLabelRepository.getReferenceById(labelId);
  }

  private Long findLabelIdByNameUncached(String labelName) {
    return procedureLabelRepository
        .findByName(labelName)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "System-populated label %s is missing".formatted(labelName)))
        .getId();
  }

  public boolean contains(List<UUID> externalLabelIds, String name) {
    return procedureLabelRepository.existsByNameAndExternalIdIn(name, externalLabelIds);
  }

  public List<ProcedureLabel> findByExternalIds(List<UUID> externalLabelIds) {
    return procedureLabelRepository.findAllByExternalIdInOrderById(externalLabelIds);
  }
}
