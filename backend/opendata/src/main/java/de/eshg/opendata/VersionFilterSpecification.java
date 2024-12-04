/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.lib.common.BusinessModule;
import de.eshg.opendata.domain.model.OpenDataFileType;
import de.eshg.opendata.domain.model.Version;
import de.eshg.opendata.domain.model.Version_;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class VersionFilterSpecification {

  private VersionFilterSpecification() {}

  public static Specification<Version> filterStatisticsStartAndEndDatesByYear(Year year) {
    return (version, query, cb) ->
        cb.or(
            startOfYearIsInStatistic(version, cb, year),
            endOfYearIsInStatistic(version, cb, year),
            statisticWithinYear(version, cb, year));
  }

  private static Predicate startOfYearIsInStatistic(
      Root<Version> version, CriteriaBuilder cb, Year year) {
    Expression<LocalDate> firstDayOfYear = cb.literal(year.atDay(1));
    return cb.and(
        cb.between(
            firstDayOfYear,
            version.get(Version_.statisticStartDate),
            version.get(Version_.statisticEndDate)));
  }

  private static Predicate endOfYearIsInStatistic(
      Root<Version> version, CriteriaBuilder cb, Year year) {
    Expression<LocalDate> lastDayOfYear = cb.literal(year.plusYears(1).atDay(1).minusDays(1));
    return cb.between(
        lastDayOfYear,
        version.get(Version_.statisticStartDate),
        version.get(Version_.statisticEndDate));
  }

  private static Predicate statisticWithinYear(
      Root<Version> version, CriteriaBuilder cb, Year year) {
    Expression<LocalDate> firstDayOfYear = cb.literal(year.atDay(1));
    Expression<LocalDate> lastDayOfYear = cb.literal(year.plusYears(1).atDay(1).minusDays(1));

    return cb.and(
        cb.greaterThanOrEqualTo(version.get(Version_.statisticStartDate), firstDayOfYear),
        cb.lessThanOrEqualTo(version.get(Version_.statisticEndDate), lastDayOfYear));
  }

  public static Specification<Version> filterBySource(List<BusinessModule> sources) {
    return (version, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      for (BusinessModule module : sources) {
        predicates.add(cb.isMember(module, version.get(Version_.sources)));
      }

      return cb.or(predicates.toArray(Predicate[]::new));
    };
  }

  public static Specification<Version> filterByFileType(OpenDataFileType fileType) {
    return (version, query, cb) -> cb.equal(version.get(Version_.fileType), fileType);
  }

  public static Specification<Version> fetchingResourcesAndSources() {
    return (root, query, criteriaBuilder) -> {
      root.fetch(Version_.resource);
      root.fetch(Version_.sources, JoinType.LEFT);
      return null;
    };
  }

  public static Specification<Version> filterBySearchString(String searchString) {
    return (version, query, cb) -> {
      Path<String> fileName = version.get(Version_.fileName);
      Path<String> description = version.get(Version_.description);
      Path<String> versionName = version.get(Version_.versionName);

      Expression<String> lowerCaseWildcardSearchString =
          cb.lower(cb.concat(cb.concat(cb.literal("%"), searchString), cb.literal("%")));

      Predicate fileNameLike = cb.like(cb.lower(fileName), lowerCaseWildcardSearchString);
      Predicate descriptionLike = cb.like(cb.lower(description), lowerCaseWildcardSearchString);
      Predicate versionNameLike = cb.like(cb.lower(versionName), lowerCaseWildcardSearchString);

      return cb.or(fileNameLike, descriptionLike, versionNameLike);
    };
  }
}
