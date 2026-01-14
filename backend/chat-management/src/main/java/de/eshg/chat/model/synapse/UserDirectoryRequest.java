/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.model.synapse;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDirectoryRequest {

  @JsonProperty("limit")
  private Integer limit;

  @JsonProperty("search_term")
  private String searchTerm;

  public Integer getLimit() {
    return limit;
  }

  public UserDirectoryRequest limit(Integer limit) {
    this.limit = limit;
    return this;
  }

  public String getSearchTerm() {
    return searchTerm;
  }

  public UserDirectoryRequest searchTerm(String searchTerm) {
    this.searchTerm = searchTerm;
    return this;
  }
}
