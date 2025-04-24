/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DeactivateRequest {

  @JsonProperty("erase")
  private Boolean eraseGdpr;

  public Boolean getEraseGdpr() {
    return eraseGdpr;
  }

  public DeactivateRequest eraseGdpr(Boolean eraseGdpr) {
    this.eraseGdpr = eraseGdpr;
    return this;
  }
}
