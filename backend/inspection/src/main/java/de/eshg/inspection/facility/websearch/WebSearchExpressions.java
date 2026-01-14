/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import static de.eshg.inspection.facility.websearch.WebSearchMapper.fromDto;
import static java.util.Locale.ROOT;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;

import de.eshg.inspection.facility.websearch.api.WebSearchEntryStatusDto;
import de.eshg.inspection.facility.websearch.persistence.WebSearch;
import de.eshg.inspection.facility.websearch.persistence.WebSearchEntry;
import de.eshg.inspection.facility.websearch.persistence.WebSearchEntry_;
import de.eshg.inspection.facility.websearch.persistence.WebSearchQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.SetJoin;
import jakarta.persistence.criteria.Subquery;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

public interface WebSearchExpressions {
  static Specification<WebSearchEntry> withWebSearch(WebSearch webSearch) {
    return (root, query, cb) -> cb.equal(root.get(WebSearchEntry_.webSearch), webSearch);
  }

  static Specification<WebSearchEntry> withName(String name) {
    if (isBlank(name)) return null;
    return (root, query, cb) ->
        cb.like(cb.lower(root.get(WebSearchEntry_.name)), "%" + name.toLowerCase(ROOT) + "%");
  }

  /** same as {@link #withName(String)} but in Java instead of SQL. */
  static boolean matchesName(WebSearchEntry entry, String name) {
    if (isBlank(name)) return true;
    return containsIgnoreCase(entry.getName(), name);
  }

  static Specification<WebSearchEntry> withAddress(String address) {
    if (isBlank(address)) return null;
    return (root, query, cb) -> cb.like(address(root, cb), "%" + address.toLowerCase(ROOT) + "%");
  }

  private static Expression<String> address(Root<WebSearchEntry> root, CriteriaBuilder cb) {
    // in sql: lower(postalCode || ' ' || city || ' ' || street || ' ' || houseNumber)
    return cb.lower(
        concat(
            cb,
            List.of(
                root.get(WebSearchEntry_.postalCode),
                cb.literal(" "),
                root.get(WebSearchEntry_.city),
                cb.literal(" "),
                root.get(WebSearchEntry_.street),
                cb.literal(" "),
                root.get(WebSearchEntry_.houseNumber))));
  }

  private static Expression<String> concat(
      CriteriaBuilder cb, List<Expression<String>> expressions) {
    return expressions.stream()
        .reduce(cb::concat)
        .orElseThrow(() -> new IllegalArgumentException("No expressions provided"));
  }

  /** same as {@link #withAddress(String)} but in Java instead of SQL. */
  static boolean matchesAddress(WebSearchEntry entry, String address) {
    if (isBlank(address)) return true;
    String entryAddress =
        StringUtils.join(
            List.of(
                entry.getPostalCode(), entry.getCity(), entry.getStreet(), entry.getHouseNumber()),
            " ");
    return containsIgnoreCase(entryAddress, address);
  }

  static Specification<WebSearchEntry> withStatus(WebSearchEntryStatusDto status) {
    if (status == null) return null;
    return (root, query, cb) -> cb.equal(root.get(WebSearchEntry_.status), fromDto(status));
  }

  static Specification<WebSearchEntry> withKeywords(String keywords) {
    if (isBlank(keywords)) return null;
    return (root, query, cb) -> {
      Subquery<Long> subquery = query.subquery(Long.class);
      Root<WebSearchEntry> subqueryRoot = subquery.correlate(root);
      SetJoin<WebSearchEntry, String> joinedTags = subqueryRoot.join(WebSearchEntry_.tags);

      subquery
          .select(subqueryRoot.get(WebSearchEntry_.id))
          .where(cb.like(joinedTags, "%" + keywords + "%"));

      return cb.exists(subquery);
    };
  }

  /** same as {@link #withKeywords(String)} but in Java instead of SQL. */
  static boolean matchesKeywords(WebSearchEntry entry, String keywords) {
    if (isBlank(keywords)) return true;
    return entry.getTags().stream().anyMatch(tag -> containsIgnoreCase(tag, keywords));
  }

  static Specification<WebSearchEntry> withIgnored(Boolean ignored) {
    return ignored != null
        ? (root, query, cb) -> cb.equal(root.get(WebSearchEntry_.ignored), ignored)
        : null;
  }

  static boolean matches(WebSearchEntry entry, WebSearchQuery query) {
    return matchesName(entry, query.getFacilityName())
        && matchesAddress(entry, query.getFacilityAddress())
        && matchesKeywords(entry, query.getKeywords());
  }
}
