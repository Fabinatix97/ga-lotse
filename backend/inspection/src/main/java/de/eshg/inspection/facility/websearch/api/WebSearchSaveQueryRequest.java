/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import de.eshg.inspection.facility.websearch.persistence.WebSearchQuery;

/**
 * request parameters to create or update a saved query for a websearch. When creating, the
 * parameter {@code queryId} must be {@code null}. In this case, {@code queryName} must not be
 * {@code null}, too. When updating {@code queryId} must denote an existing saved {@link
 * WebSearchQuery#getId() WebSearchQuery-ID}.
 */
public record WebSearchSaveQueryRequest(
    Long queryId, String queryName, String facilityName, String facilityAddress, String keywords) {
  public WebSearchSaveQueryRequest() {
    this(null, null, null, null, null);
  }

  public WebSearchSaveQueryRequest withQueryId(long queryId) {
    return new WebSearchSaveQueryRequest(
        queryId, queryName, facilityName, facilityAddress, keywords);
  }

  public WebSearchSaveQueryRequest withQueryName(String queryName) {
    return new WebSearchSaveQueryRequest(
        queryId, queryName, facilityName, facilityAddress, keywords);
  }

  public WebSearchSaveQueryRequest withFacilityName(String facilityName) {
    return new WebSearchSaveQueryRequest(
        queryId, queryName, facilityName, facilityAddress, keywords);
  }

  public WebSearchSaveQueryRequest withFacilityAddress(String facilityAddress) {
    return new WebSearchSaveQueryRequest(
        queryId, queryName, facilityName, facilityAddress, keywords);
  }

  public WebSearchSaveQueryRequest withKeywords(String keywords) {
    return new WebSearchSaveQueryRequest(
        queryId, queryName, facilityName, facilityAddress, keywords);
  }
}
