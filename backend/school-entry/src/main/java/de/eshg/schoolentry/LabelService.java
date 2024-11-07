/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.population.CreateLabelsTask.INFORMATION_BLOCK_LABEL_NAME;
import static de.eshg.schoolentry.population.CreateLabelsTask.SPECIAL_NEEDS_LABEL_NAME;

import de.eshg.schoolentry.domain.model.Label;
import de.eshg.schoolentry.domain.repository.LabelRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class LabelService {
  private final LabelRepository labelRepository;
  private final Map<String, Long> cachedLabelIds = new ConcurrentHashMap<>();

  public LabelService(LabelRepository labelRepository) {
    this.labelRepository = labelRepository;
  }

  public Label getSpecialNeedsLabel() {
    return findSystemLabelOrThrow(SPECIAL_NEEDS_LABEL_NAME);
  }

  public Label getInformationBlockLabel() {
    return findSystemLabelOrThrow(INFORMATION_BLOCK_LABEL_NAME);
  }

  private Label findSystemLabelOrThrow(String name) {
    Long labelId = cachedLabelIds.computeIfAbsent(name, this::findLabelIdByNameUncached);
    return labelRepository.getReferenceById(labelId);
  }

  private Long findLabelIdByNameUncached(String labelName) {
    return labelRepository
        .findByName(labelName)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "System-populated label %s is missing".formatted(labelName)))
        .getId();
  }

  public boolean contains(List<UUID> externalLabelIds, String name) {
    return labelRepository.existsByNameAndExternalIdIn(name, externalLabelIds);
  }

  public List<Label> findByExternalIds(List<UUID> externalLabelIds) {
    return labelRepository.findAllByExternalIdInOrderById(externalLabelIds);
  }
}
