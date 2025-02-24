/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AddExternalIdRequest {

  @JsonProperty("external_ids")
  List<ExternalIdMapping> externalIds;

  public List<ExternalIdMapping> getExternalIds() {
    return externalIds;
  }

  public AddExternalIdRequest externalIds(List<ExternalIdMapping> externalIds) {
    this.externalIds = externalIds;
    return this;
  }
}
