/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record DefaultPopulationResponse(@Valid List<Population> populations) {

  public record Population(
      String populatorName,
      @NotNull int numberOfPopulatedEntities,
      @NotNull long totalNumberOfEntities) {}
}
