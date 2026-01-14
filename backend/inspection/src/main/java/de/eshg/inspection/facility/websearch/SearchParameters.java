/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import static de.eshg.inspection.util.PageRequestUtil.createPageRequest;
import static org.springframework.util.CollectionUtils.isEmpty;

import de.eshg.inspection.facility.websearch.api.WebSearchEntryStatusDto;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.PageRequest;

public record SearchParameters(
    String name,
    String address,
    WebSearchEntryStatusDto status,
    String keywords,
    Boolean ignored,
    PageRequest pageRequest) {

  private static final List<String> DEFAULT_SORT = List.of("name,asc");

  public SearchParameters(
      Integer pageNumber,
      Integer pageSize,
      String name,
      String address,
      WebSearchEntryStatusDto status,
      String keywords,
      Boolean ignored,
      List<String> sort) {
    this(
        name,
        address,
        status,
        keywords,
        ignored,
        createPageRequest(
            pageNumber,
            pageSize,
            createSort(sort),
            "id",
            "status",
            "name",
            "postalCode",
            "city",
            "street"));
  }

  private static List<String> createSort(List<String> sort) {
    sort = new ArrayList<>(isEmpty(sort) ? DEFAULT_SORT : sort);
    sort.add("id,asc");
    return sort;
  }
}
