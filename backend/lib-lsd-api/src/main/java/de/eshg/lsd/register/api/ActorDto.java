/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Actor")
public record ActorDto(
    @NotNull String commonName,
    @Valid CertificateDto certificate,
    ActorTypeDto type,
    String readableName) {

  public ActorDto(@NotNull String commonName) {
    this(commonName, null, null, null);
  }
}
