/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import de.eshg.inspection.facility.websearch.api.WebSearchDto;
import de.eshg.inspection.facility.websearch.api.WebSearchEntryDto;
import de.eshg.inspection.facility.websearch.api.WebSearchEntryStatusDto;
import de.eshg.inspection.facility.websearch.api.WebSearchOverviewEntryDto;
import de.eshg.inspection.facility.websearch.api.WebSearchQueryDto;
import de.eshg.inspection.facility.websearch.api.WebSearchRequest;
import de.eshg.inspection.facility.websearch.api.WebSearchStatusDto;
import de.eshg.inspection.facility.websearch.persistence.WebSearch;
import de.eshg.inspection.facility.websearch.persistence.WebSearchEntry;
import de.eshg.inspection.facility.websearch.persistence.WebSearchEntryStatus;
import de.eshg.inspection.facility.websearch.persistence.WebSearchQuery;
import de.eshg.inspection.facility.websearch.persistence.WebSearchStatus;

public class WebSearchMapper {
  private WebSearchMapper() {}

  static WebSearch requestToWebSearch(WebSearchRequest request) {
    return new WebSearch(request.name(), request.basicURL(), request.searchCity());
  }

  static WebSearchDto toDto(WebSearch webSearch) {
    return new WebSearchDto(
        webSearch.getId(),
        webSearch.getName(),
        webSearch.getBasicURL(),
        webSearch.getSearchCity(),
        toDto(webSearch.getStatus()),
        webSearch.getRunningSince(),
        webSearch.getLastExecution(),
        webSearch.getLastSuccessfulExecution(),
        webSearch.getQueries().stream().map(WebSearchMapper::toDto).toList());
  }

  static WebSearchQueryDto toDto(WebSearchQuery query) {
    return new WebSearchQueryDto(
        query.getId(),
        query.getQueryName(),
        query.getFacilityName(),
        query.getFacilityAddress(),
        query.getKeywords());
  }

  static WebSearchEntryDto toDto(WebSearchEntry entry) {
    return new WebSearchEntryDto(
        entry.getExternalId(),
        entry.getName(),
        entry.getPostalCode(),
        entry.getCity(),
        entry.getStreet(),
        toDto(entry.getStatus()),
        entry.isIgnored(),
        entry.getHouseNumber(),
        entry.getAddressAddition(),
        entry.getPhoneNumber(),
        entry.getEmail(),
        entry.getCentralFileStateId(),
        entry.getTags().stream().toList());
  }

  static WebSearchOverviewEntryDto toOverviewDto(WebSearch webSearch) {
    return new WebSearchOverviewEntryDto(
        webSearch.getId(),
        webSearch.getName(),
        webSearch.getBasicURL(),
        webSearch.getSearchCity(),
        toDto(webSearch.getStatus()),
        webSearch.getEntryCount(),
        webSearch.getRunningSince(),
        webSearch.getLastExecution(),
        webSearch.getLastSuccessfulExecution());
  }

  static WebSearchStatusDto toDto(WebSearchStatus status) {
    return switch (status) {
      case NEW -> WebSearchStatusDto.NEW;
      case IDLE -> WebSearchStatusDto.IDLE;
      case RUNNING -> WebSearchStatusDto.RUNNING;
      case PAUSED -> WebSearchStatusDto.PAUSED;
      case ERRONEOUS -> WebSearchStatusDto.ERRONEOUS;
    };
  }

  static WebSearchEntryStatusDto toDto(WebSearchEntryStatus status) {
    return switch (status) {
      case NEW -> WebSearchEntryStatusDto.NEW;
      case SAVED -> WebSearchEntryStatusDto.SAVED;
      case CHANGED -> WebSearchEntryStatusDto.CHANGED;
      case DELETED -> WebSearchEntryStatusDto.DELETED;
    };
  }

  static WebSearchEntryStatus fromDto(WebSearchEntryStatusDto status) {
    return switch (status) {
      case NEW -> WebSearchEntryStatus.NEW;
      case SAVED -> WebSearchEntryStatus.SAVED;
      case CHANGED -> WebSearchEntryStatus.CHANGED;
      case DELETED -> WebSearchEntryStatus.DELETED;
    };
  }
}
