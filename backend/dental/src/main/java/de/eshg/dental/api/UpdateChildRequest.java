/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record UpdateChildRequest(
    @NotNull long version,
    String groupName,
    @NotNull UUID institutionId,
    @Valid FluoridationConsentDto fluoridationConsent,
    @NotNull List<UUID> procedureLabels) {
  public UpdateChildRequest(
      long version,
      String groupName,
      UUID institutionId,
      FluoridationConsentDto fluoridationConsent,
      List<UUID> procedureLabels) {
    this.version = version;
    this.groupName = groupName;
    this.institutionId = institutionId;
    this.fluoridationConsent = fluoridationConsent;
    this.procedureLabels = procedureLabels;
  }

  public UpdateChildRequest(long version, String groupName, UUID institutionId) {
    this(version, groupName, institutionId, null, List.of());
  }

  public UpdateChildRequest(
      long version,
      String groupName,
      UUID institutionId,
      FluoridationConsentDto fluoridationConsent) {
    this(version, groupName, institutionId, fluoridationConsent, List.of());
  }
}
