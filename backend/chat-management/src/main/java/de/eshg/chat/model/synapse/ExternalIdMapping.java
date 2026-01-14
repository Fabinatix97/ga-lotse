/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalIdMapping {

  @JsonProperty("auth_provider")
  private String authProvider;

  @JsonProperty("external_id")
  private String externalId;

  public String getAuthProvider() {
    return authProvider;
  }

  public ExternalIdMapping authProvider(String authProvider) {
    this.authProvider = authProvider;
    return this;
  }

  public String getExternalId() {
    return externalId;
  }

  public ExternalIdMapping externalId(String externalId) {
    this.externalId = externalId;
    return this;
  }
}
