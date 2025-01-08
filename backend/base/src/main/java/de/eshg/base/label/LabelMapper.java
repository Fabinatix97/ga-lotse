/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.label;

import de.eshg.base.label.api.AddLabelRequest;
import de.eshg.base.label.api.LabelDto;
import de.eshg.base.label.persistence.entity.Label;

public class LabelMapper {

  private LabelMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static Label mapLabelToDm(AddLabelRequest request) {
    Label label = new Label();
    label.setName(request.name());
    return label;
  }

  public static LabelDto mapLabelToApi(Label savedLabel) {
    return new LabelDto(savedLabel.getId(), savedLabel.getName());
  }
}
