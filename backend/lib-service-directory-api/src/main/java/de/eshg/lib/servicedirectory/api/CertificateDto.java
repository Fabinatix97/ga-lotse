/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "Certificate")
public record CertificateDto(@NotBlank String value, String signature, String signatory) {

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
