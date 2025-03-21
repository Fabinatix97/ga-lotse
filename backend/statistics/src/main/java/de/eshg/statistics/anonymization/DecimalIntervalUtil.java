/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.anonymization;

import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.deidentifier.arx.Data;
import org.deidentifier.arx.DataType;
import org.deidentifier.arx.aggregates.HierarchyBuilderIntervalBased;

public class DecimalIntervalUtil {
  private static final BigDecimal MINIMAL_DIFFERENCE = BigDecimal.valueOf(0.0001);

  private DecimalIntervalUtil() {}

  static Interval<Number> configureColumn(
      Data.DefaultData data, String column, AnonymizationConfiguration anonymizationConfiguration) {
    List<Interval<BigDecimal>> intervalList = createIntervals(column, anonymizationConfiguration);

    HierarchyBuilderIntervalBased<Double> builder = createIntervalBasedBuilder(intervalList);
    data.getDefinition().setAttributeType(column, builder);

    return new Interval<>(
        intervalList.getFirst().minInclusive(), intervalList.getLast().maxExclusive());
  }

  private static List<Interval<BigDecimal>> createIntervals(
      String column, AnonymizationConfiguration anonymizationConfiguration) {
    if (anonymizationConfiguration.getIntervalCount() == null) {
      if (anonymizationConfiguration.getDecimalBorders().isEmpty()) {
        throw new IllegalStateException("Interval not configured for decimal %s".formatted(column));
      } else if (anonymizationConfiguration.getDecimalBorders().size() < 2) {
        throw new IllegalStateException("Not enough borders for decimal %s".formatted(column));
      } else {
        return createIntervals(anonymizationConfiguration.getDecimalBorders().stream().toList());
      }
    } else {
      if (anonymizationConfiguration.getMinDecimalInclusive() == null) {
        throw new IllegalStateException(
            "Interval configuration missing minimal value for decimal %s".formatted(column));
      } else if (anonymizationConfiguration.getMaxDecimalInclusive() == null) {
        throw new IllegalStateException(
            "Interval configuration missing maximal value for decimal %s".formatted(column));
      } else {
        return createIntervals(
            column,
            anonymizationConfiguration.getMinDecimalInclusive(),
            anonymizationConfiguration.getMaxDecimalInclusive(),
            anonymizationConfiguration.getIntervalCount());
      }
    }
  }

  private static List<Interval<BigDecimal>> createIntervals(List<BigDecimal> borders) {
    List<Interval<BigDecimal>> intervals = new ArrayList<>();
    for (int i = 0; i < borders.size() - 2; i++) {
      intervals.add(new Interval<>(borders.get(i), borders.get(i + 1)));
    }
    intervals.add(
        new Interval<>(
            borders.get(borders.size() - 2), round(borders.getLast().add(MINIMAL_DIFFERENCE))));

    return intervals;
  }

  private static List<Interval<BigDecimal>> createIntervals(
      String column, BigDecimal minInclusive, BigDecimal maxInclusive, int countIntervals) {
    BigDecimal intervalSize =
        maxInclusive
            .add(MINIMAL_DIFFERENCE)
            .subtract(minInclusive)
            .divide(BigDecimal.valueOf(countIntervals), 4, RoundingMode.HALF_UP);

    if (intervalSize.compareTo(BigDecimal.ZERO) <= 0) {
      throw new IllegalStateException("No intervals possible for decimal %s".formatted(column));
    }

    List<Interval<BigDecimal>> intervals = new ArrayList<>();
    BigDecimal lowerBound = minInclusive;
    for (int i = 1; i < countIntervals; i++) {
      BigDecimal upperBoundExclusive = round(lowerBound.add(intervalSize));
      intervals.add(new Interval<>(lowerBound, upperBoundExclusive));
      lowerBound = upperBoundExclusive;
    }
    intervals.add(new Interval<>(lowerBound, round(maxInclusive.add(MINIMAL_DIFFERENCE))));

    if (intervals.getLast().minInclusive().compareTo(intervals.getLast().maxExclusive()) >= 0) {
      throw new IllegalStateException("No intervals possible for decimal %s".formatted(column));
    }
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
