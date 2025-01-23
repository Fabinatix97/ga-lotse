/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateChildRequest(
    @NotNull long version,
    @NotBlank String groupName,
    @NotNull UUID institutionId,
    @Valid FluoridationConsentDto fluoridationConsent) {
  public UpdateChildRequest(
      long version,
      String groupName,
      UUID institutionId,
      FluoridationConsentDto fluoridationConsent) {
    this.version = version;
    this.groupName = groupName;
    this.institutionId = institutionId;
    this.fluoridationConsent = fluoridationConsent;
  }

  public UpdateChildRequest(long version, String groupName, UUID institutionId) {
    this(version, groupName, institutionId, null);
  }
}
