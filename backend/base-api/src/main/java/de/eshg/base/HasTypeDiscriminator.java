/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.constraints.NotNull;

public interface HasTypeDiscriminator {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
