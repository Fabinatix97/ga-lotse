/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.lib.common.BusinessModule;
import de.eshg.opendata.api.GetOpenDocumentsRequest;
import de.eshg.opendata.domain.model.OpenDataFileType;
import de.eshg.opendata.domain.model.Version;
import de.eshg.opendata.domain.model.Version_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

class VersionFilterSpecification {

  private VersionFilterSpecification() {}

  static Predicate filterForOnlyMostRecentMinorVersions(
      Path<Version> rootVersion, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    Subquery<Integer> subquery = query.subquery(Integer.class);
    Root<Version> subqueryVersion = subquery.from(Version.class);
    Path<Integer> minorVersion = subqueryVersion.get(Version_.minor);

    Predicate resourceEquals =
        criteriaBuilder.equal(
            rootVersion.get(Version_.resource), subqueryVersion.get(Version_.resource));
    Predicate majorVersionEquals =
        criteriaBuilder.equal(rootVersion.get(Version_.major), subqueryVersion.get(Version_.major));
    subquery.where(criteriaBuilder.and(resourceEquals, majorVersionEquals));

    return criteriaBuilder.equal(
        rootVersion.get(Version_.minor), subquery.select(criteriaBuilder.max(minorVersion)));
  }

  static Predicate filterVersions(
      GetOpenDocumentsRequest filterOptions, CriteriaBuilder cb, Path<Version> version) {
    ArrayList<Predicate> conjunctions = new ArrayList<>();

    if (filterOptions.sourcesFilter() != null) {
      conjunctions.add(filterSources(cb, version, filterOptions.sourcesFilter()));
    }

    if (filterOptions.fileTypeFilter() != null) {
      conjunctions.add(filterFileType(cb, version, filterOptions.fileTypeFilter()));
    }

    if (filterOptions.statisticsYearFilter() != null) {
      conjunctions.add(filterYear(cb, version, filterOptions.statisticsYearFilter()));
    }

    if (filterOptions.searchString() != null) {
      conjunctions.add(filterBySearchString(cb, version, filterOptions.searchString()));
    }

    return cb.and(conjunctions.toArray(Predicate[]::new));
  }

  private static Predicate filterBySearchString(
      CriteriaBuilder cb, Path<Version> version, String searchString) {

    Path<String> fileName = version.get(Version_.fileName);
    Path<String> description = version.get(Version_.description);
    Path<String> versionName = version.get(Version_.versionName);

    Expression<String> lowerCaseWildcardSearchString =
        cb.lower(cb.concat(cb.concat(cb.literal("%"), searchString), cb.literal("%")));

    Predicate fileNameLike = cb.like(cb.lower(fileName), lowerCaseWildcardSearchString);
    Predicate descriptionLike = cb.like(cb.lower(description), lowerCaseWildcardSearchString);
    Predicate versionNameLike = cb.like(cb.lower(versionName), lowerCaseWildcardSearchString);

    return cb.or(fileNameLike, descriptionLike, versionNameLike);
  }

  private static Predicate filterFileType(
      CriteriaBuilder cb, Path<Version> version, OpenDataFileType fileType) {
    return cb.equal(version.get(Version_.fileType), fileType);
  }

  private static Predicate filterSources(
      CriteriaBuilder cb, Path<Version> version, List<BusinessModule> sources) {
    List<Predicate> predicates = new ArrayList<>();
    for (BusinessModule module : sources) {
      predicates.add(cb.isMember(module, version.get(Version_.sources)));
    }

    return cb.or(predicates.toArray(Predicate[]::new));
  }

  private static Predicate filterYear(CriteriaBuilder cb, Path<Version> version, Year year) {
    return cb.or(
        startOfYearIsInStatistic(version, cb, year),
        endOfYearIsInStatistic(version, cb, year),
        statisticWithinYear(version, cb, year));
  }

  private static Predicate startOfYearIsInStatistic(
      Path<Version> version, CriteriaBuilder cb, Year year) {
    Expression<LocalDate> firstDayOfYear = cb.literal(year.atDay(1));
    return cb.and(
        cb.between(
            firstDayOfYear,
            version.get(Version_.statisticStartDate),
            version.get(Version_.statisticEndDate)));
  }

  private static Predicate endOfYearIsInStatistic(
      Path<Version> version, CriteriaBuilder cb, Year year) {
    Expression<LocalDate> lastDayOfYear = cb.literal(year.plusYears(1).atDay(1).minusDays(1));
    return cb.between(
        lastDayOfYear,
        version.get(Version_.statisticStartDate),
        version.get(Version_.statisticEndDate));
  }

  private static Predicate statisticWithinYear(
      Path<Version> version, CriteriaBuilder cb, Year year) {
    Expression<LocalDate> firstDayOfYear = cb.literal(year.atDay(1));
    Expression<LocalDate> lastDayOfYear = cb.literal(year.plusYears(1).atDay(1).minusDays(1));

    return cb.and(
        cb.greaterThanOrEqualTo(version.get(Version_.statisticStartDate), firstDayOfYear),
        cb.lessThanOrEqualTo(version.get(Version_.statisticEndDate), lastDayOfYear));
  }
}
