/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Certificate")
public record CertificateDto(
    @NotNull String value, @NotNull String signature, @NotNull String signatory) {

  @Override
  public String toString() {
    return "CertificateDto{"
        + "value='"
        + value
        + '\''
        + ", signature='"
        + signature
        + '\''
        + ", signatory='"
        + signatory
        + '\''
        + '}';
  }
}
