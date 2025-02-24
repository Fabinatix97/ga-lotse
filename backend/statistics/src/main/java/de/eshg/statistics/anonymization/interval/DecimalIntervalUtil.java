/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization.interval;

import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import org.deidentifier.arx.Data;
import org.deidentifier.arx.DataType;
import org.deidentifier.arx.aggregates.HierarchyBuilderIntervalBased;

public class DecimalIntervalUtil {
  private static final BigDecimal MINIMAL_DIFFERENCE = BigDecimal.valueOf(0.0001);

  private DecimalIntervalUtil() {}

  public static DecimalIntervalConfiguration createIntervalConfiguration(
      AnonymizationConfiguration anonymizationConfiguration) {
    if (anonymizationConfiguration == null) {
      return null;
    }
    if (anonymizationConfiguration.getIntervalCount() == null) {
      Set<BigDecimal> borders = anonymizationConfiguration.getDecimalBorders();
      if (borders.isEmpty()) {
        return null;
      } else {
        return new DecimalIntervalBordersConfiguration(borders.stream().toList());
      }
    } else {
      if (anonymizationConfiguration.getMinDecimalInclusive() == null
          || anonymizationConfiguration.getMaxDecimalInclusive() == null) {
        return new CountIntervalConfiguration(anonymizationConfiguration.getIntervalCount());
      } else {
        return new DecimalMinMaxCountIntervalConfiguration(
            anonymizationConfiguration.getMinDecimalInclusive(),
            anonymizationConfiguration.getMaxDecimalInclusive(),
            anonymizationConfiguration.getIntervalCount());
      }
    }
  }

  public static Optional<Interval<Number>> configureColumn(
      Data.DefaultData data,
      String column,
      BigDecimal minDecimal,
      BigDecimal maxDecimal,
      DecimalIntervalConfiguration intervalConfiguration) {
    List<Interval<BigDecimal>> intervalList =
        switch (intervalConfiguration) {
          case CountIntervalConfiguration(int countIntervals) -> {
            if (minDecimal != null && maxDecimal != null) {
              yield createIntervals(minDecimal, maxDecimal, countIntervals);
            } else {
              yield Collections.emptyList();
            }
          }
          case DecimalIntervalBordersConfiguration(List<BigDecimal> intervalBorders) ->
              createIntervals(intervalBorders);
          case DecimalMinMaxCountIntervalConfiguration(
                  BigDecimal minInclusive,
                  BigDecimal maxInclusive,
                  int countIntervals) ->
              createIntervals(minInclusive, maxInclusive, countIntervals);
        };

    HierarchyBuilderIntervalBased<Double> builder = createIntervalBasedBuilder(intervalList);

    data.getDefinition().setAttributeType(column, builder);
    if (intervalList.isEmpty()) {
      return Optional.empty();
    } else {
      return Optional.of(
          new Interval<>(
              intervalList.getFirst().minInclusive(), intervalList.getLast().maxExclusive()));
    }
  }

  private static List<Interval<BigDecimal>> createIntervals(
      BigDecimal minInclusive, BigDecimal maxInclusive, int countIntervals) {
    BigDecimal intervalSize =
        maxInclusive
            .add(MINIMAL_DIFFERENCE)
            .subtract(minInclusive)
            .divide(BigDecimal.valueOf(countIntervals), 4, RoundingMode.HALF_UP);

    if (intervalSize.compareTo(BigDecimal.ZERO) == 0) {
      return Collections.emptyList();
    }

    List<Interval<BigDecimal>> intervals = new ArrayList<>();
    BigDecimal lowerBound = minInclusive;
    for (int i = 1; i < countIntervals; i++) {
      BigDecimal upperBoundExclusive = round(lowerBound.add(intervalSize));
      intervals.add(new Interval<>(lowerBound, upperBoundExclusive));
      lowerBound = upperBoundExclusive;
    }
    intervals.add(new Interval<>(lowerBound, round(maxInclusive.add(MINIMAL_DIFFERENCE))));

    return intervals;
  }

  private static List<Interval<BigDecimal>> createIntervals(List<BigDecimal> borders) {
    if (borders.size() < 2) {
      return Collections.emptyList();
    }
    List<Interval<BigDecimal>> intervals = new ArrayList<>();
    for (int i = 0; i < borders.size() - 2; i++) {
      intervals.add(new Interval<>(borders.get(i), borders.get(i + 1)));
    }
    intervals.add(
        new Interval<>(
            borders.get(borders.size() - 2), round(borders.getLast().add(MINIMAL_DIFFERENCE))));

    return intervals;
  }

  private static BigDecimal round(BigDecimal decimal) {
    return decimal.setScale(4, RoundingMode.HALF_UP);
  }

  private static HierarchyBuilderIntervalBased<Double> createIntervalBasedBuilder(
      List<Interval<BigDecimal>> intervalList) {
    DataType<Double> dataType = DataType.createDecimal("#.####", Locale.ENGLISH);
    HierarchyBuilderIntervalBased<Double> builder = HierarchyBuilderIntervalBased.create(dataType);
    builder.setAggregateFunction(dataType.createAggregate().createIntervalFunction(true, false));

    intervalList.forEach(
        interval ->
            builder.addInterval(
                interval.minInclusive().doubleValue(),
                interval.maxExclusive().doubleValue(),
                "["
                    + interval.minInclusive().stripTrailingZeros().toPlainString()
                    + ","
                    + round(interval.maxExclusive().subtract(MINIMAL_DIFFERENCE))
                        .stripTrailingZeros()
                        .toPlainString()
                    + "]"));
    return builder;
  }
}
