/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label;

import de.eshg.base.label.api.AddLabelRequest;
import de.eshg.base.label.api.GetLabelsResponse;
import de.eshg.base.label.api.LabelDto;
import de.eshg.base.label.persistence.LabelService;
import de.eshg.base.label.persistence.entity.Label;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Label")
public class LabelController implements LabelApi {

  private final LabelService labelService;

  public LabelController(LabelService labelService) {
    this.labelService = labelService;
  }

  @Override
  public LabelDto addLabel(AddLabelRequest request) {
    Label label = labelService.getOrAdd(request);
    return LabelMapper.mapLabelToApi(label);
  }

  @Override
  public LabelDto getLabel(UUID id) {
    Label label =
        labelService.findById(id).orElseThrow(() -> new NotFoundException("Label not found"));
    return LabelMapper.mapLabelToApi(label);
  }

  @Override
  public GetLabelsResponse getLabels(String name) {
    List<Label> results = labelService.findAll(name);
    return new GetLabelsResponse(results.stream().map(LabelMapper::mapLabelToApi).toList());
  }
}
