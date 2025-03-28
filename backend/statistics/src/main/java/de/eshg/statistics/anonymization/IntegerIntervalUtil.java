/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import de.eshg.statistics.persistence.entity.TableColumn;
import java.util.ArrayList;
import java.util.List;
import org.deidentifier.arx.Data;
import org.deidentifier.arx.DataType;
import org.deidentifier.arx.aggregates.HierarchyBuilderIntervalBased;

public class IntegerIntervalUtil {

  private static final long MINIMAL_DIFFERENCE = 1L;

  private IntegerIntervalUtil() {}

  static Interval<Number> configureColumn(
      Data.DefaultData data, String column, AnonymizationConfiguration anonymizationConfiguration) {
    List<Interval<Long>> intervalList = createIntervals(column, anonymizationConfiguration);

    HierarchyBuilderIntervalBased<Long> builder = createIntervalBasedBuilder(intervalList);
    data.getDefinition().setAttributeType(column, builder);

    return new Interval<>(
        intervalList.getFirst().minInclusive(), intervalList.getLast().maxExclusive());
  }

  private static List<Interval<Long>> createIntervals(
      String column, AnonymizationConfiguration anonymizationConfiguration) {
    if (anonymizationConfiguration.getIntervalCount() == null) {
      if (anonymizationConfiguration.getIntegerBorders().isEmpty()) {
        throw new IllegalStateException("Interval not configured for integer %s".formatted(column));
      } else if (anonymizationConfiguration.getIntegerBorders().size() < 2) {
        throw new IllegalStateException("Not enough borders for integer %s".formatted(column));
      } else {
        return createIntervals(anonymizationConfiguration.getIntegerBorders().stream().toList());
      }
    } else {
      if (anonymizationConfiguration.getMinIntegerInclusive() == null) {
        throw new IllegalStateException(
            "Interval configuration missing minimal value for integer %s".formatted(column));
      } else if (anonymizationConfiguration.getMaxIntegerInclusive() == null) {
        throw new IllegalStateException(
            "Interval configuration missing maximal value for integer %s".formatted(column));
      } else {
        return createIntervals(
            column,
            anonymizationConfiguration.getMinIntegerInclusive(),
            anonymizationConfiguration.getMaxIntegerInclusive(),
            anonymizationConfiguration.getIntervalCount());
      }
    }
  }

  private static List<Interval<Long>> createIntervals(List<Integer> borders) {
    List<Interval<Long>> intervals = new ArrayList<>();
    for (int i = 0; i < borders.size() - 2; i++) {
      intervals.add(new Interval<>((long) borders.get(i), (long) borders.get(i + 1)));
    }
    intervals.add(
        new Interval<>(
            (long) borders.get(borders.size() - 2), (long) borders.getLast() + MINIMAL_DIFFERENCE));

    return intervals;
  }

  private static List<Interval<Long>> createIntervals(
      String column, int minInclusive, int maxInclusive, int countIntervals) {
    long intervalSize = (maxInclusive + MINIMAL_DIFFERENCE - minInclusive) / countIntervals;
    if (intervalSize == 0) {
      throw new IllegalStateException("No intervals possible for integer %s".formatted(column));
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
                AnonymizationService.INTERVAL_FORMAT_STRING.formatted(
                    interval.minInclusive(), interval.maxExclusive() - MINIMAL_DIFFERENCE)));
    return builder;
  }

  public static List<String> getIntervalsAsStringList(TableColumn tableColumn) {
    List<Interval<Long>> intervals =
        createIntervals(tableColumn.getSearchKey(), tableColumn.getAnonymizationConfiguration());

    return intervals.stream()
        .map(
            interval ->
                AnonymizationService.INTERVAL_FORMAT_STRING.formatted(
                    interval.minInclusive(), interval.maxExclusive() - MINIMAL_DIFFERENCE))
        .toList();
  }
}
