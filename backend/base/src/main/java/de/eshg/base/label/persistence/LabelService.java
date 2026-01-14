/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label.persistence;

import de.eshg.base.label.LabelMapper;
import de.eshg.base.label.api.AddLabelRequest;
import de.eshg.base.label.persistence.entity.Label;
import de.eshg.base.label.persistence.entity.Label_;
import de.eshg.base.label.persistence.repository.LabelRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class LabelService {

  private final LabelRepository labelRepository;

  public LabelService(LabelRepository labelRepository) {
    this.labelRepository = labelRepository;
  }

  public Label getOrAdd(AddLabelRequest request) {
    return findByName(request.name())
        .orElseGet(
            () -> {
              Label newLabel = LabelMapper.mapLabelToDm(request);
              return labelRepository.save(newLabel);
            });
  }

  public Label getOrAdd(String name) {
    return getOrAdd(new AddLabelRequest(name));
  }

  public Optional<Label> findByName(String name) {
    return labelRepository.findByName(name);
  }

  public Optional<Label> findById(UUID id) {
    return labelRepository.findById(id);
  }

  public List<Label> findAll(String name) {
    if (name == null || name.isEmpty()) {
      return labelRepository.findAll(Sort.by(Sort.Direction.ASC, Label_.NAME));
    } else {
      return labelRepository.findByNameContainingIgnoreCaseOrderByNameAsc(name);
    }
  }
}
