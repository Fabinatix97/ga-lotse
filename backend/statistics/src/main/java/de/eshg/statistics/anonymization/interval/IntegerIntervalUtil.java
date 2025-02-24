/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.deidentifier.arx.Data;
import org.deidentifier.arx.DataType;
import org.deidentifier.arx.aggregates.HierarchyBuilderIntervalBased;

public class IntegerIntervalUtil {

  private static final long MINIMAL_DIFFERENCE = 1L;

  private IntegerIntervalUtil() {}

  public static IntegerIntervalConfiguration createIntervalConfiguration(
      AnonymizationConfiguration anonymizationConfiguration) {
    if (anonymizationConfiguration == null) {
      return null;
    }
    if (anonymizationConfiguration.getIntervalCount() == null) {
      Set<Integer> borders = anonymizationConfiguration.getIntegerBorders();
      if (borders.isEmpty()) {
        return null;
      } else {
        return new IntegerIntervalBordersConfiguration(borders.stream().toList());
      }
    } else {
      if (anonymizationConfiguration.getMinIntegerInclusive() == null
          || anonymizationConfiguration.getMaxIntegerInclusive() == null) {
        return new CountIntervalConfiguration(anonymizationConfiguration.getIntervalCount());
      } else {
        return new IntegerMinMaxCountIntervalConfiguration(
            anonymizationConfiguration.getMinIntegerInclusive(),
            anonymizationConfiguration.getMaxIntegerInclusive(),
            anonymizationConfiguration.getIntervalCount());
      }
    }
  }

  public static Optional<Interval<Number>> configureColumn(
      Data.DefaultData data,
      String column,
      Integer minInteger,
      Integer maxInteger,
      IntegerIntervalConfiguration intervalConfiguration) {
    List<Interval<Long>> intervalList =
        switch (intervalConfiguration) {
          case CountIntervalConfiguration(int countIntervals) -> {
            if (minInteger != null && maxInteger != null) {
              yield createIntervals(minInteger, maxInteger, countIntervals);
            } else {
              yield Collections.emptyList();
            }
          }
          case IntegerIntervalBordersConfiguration(List<Integer> intervalBorders) ->
              createIntervals(intervalBorders);
          case IntegerMinMaxCountIntervalConfiguration(
                  int minInclusive,
                  int maxInclusive,
                  int countIntervals) ->
              createIntervals(minInclusive, maxInclusive, countIntervals);
        };

    HierarchyBuilderIntervalBased<Long> builder = createIntervalBasedBuilder(intervalList);

    data.getDefinition().setAttributeType(column, builder);
    if (intervalList.isEmpty()) {
      return Optional.empty();
    } else {
      return Optional.of(
          new Interval<>(
              intervalList.getFirst().minInclusive(), intervalList.getLast().maxExclusive()));
    }
  }

  private static List<Interval<Long>> createIntervals(
      int minInclusive, int maxInclusive, int countIntervals) {
    long intervalSize = (maxInclusive + MINIMAL_DIFFERENCE - minInclusive) / countIntervals;
    if (intervalSize == 0) {
      return Collections.emptyList();
    }
    List<Interval<Long>> intervals = new ArrayList<>();
    long lowerBound = minInclusive;
    for (int i = 1; i < countIntervals; i++) {
      long upperBoundExclusive = lowerBound + intervalSize;
      intervals.add(new Interval<>(lowerBound, upperBoundExclusive));
      lowerBound = upperBoundExclusive;
    }
    intervals.add(new Interval<>(lowerBound, maxInclusive + MINIMAL_DIFFERENCE));

    return intervals;
  }

  private static List<Interval<Long>> createIntervals(List<Integer> borders) {
    if (borders.size() < 2) {
      return Collections.emptyList();
    }
    List<Interval<Long>> intervals = new ArrayList<>();
    for (int i = 0; i < borders.size() - 2; i++) {
      intervals.add(new Interval<>((long) borders.get(i), (long) borders.get(i + 1)));
    }
    intervals.add(
        new Interval<>(
            (long) borders.get(borders.size() - 2), (long) borders.getLast() + MINIMAL_DIFFERENCE));

    return intervals;
  }

  private static HierarchyBuilderIntervalBased<Long> createIntervalBasedBuilder(
      List<Interval<Long>> intervalList) {
    HierarchyBuilderIntervalBased<Long> builder =
        HierarchyBuilderIntervalBased.create(DataType.INTEGER);
    builder.setAggregateFunction(
        DataType.INTEGER.createAggregate().createIntervalFunction(true, false));

    intervalList.forEach(
        interval ->
            builder.addInterval(
                interval.minInclusive(),
                interval.maxExclusive(),
                "["
                    + interval.minInclusive()
                    + ","
                    + (interval.maxExclusive() - MINIMAL_DIFFERENCE)
                    + "]"));
    return builder;
  }
}
