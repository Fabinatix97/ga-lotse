/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.mapper;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.interval.DecimalIntervalBordersConfiguration;
import de.eshg.lib.statistics.api.interval.DecimalMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.api.interval.IntegerIntervalBordersConfiguration;
import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import de.eshg.statistics.persistence.entity.TableColumnDataPrivacyCategory;
import java.math.BigDecimal;

public class AnonymizationConfigurationMapper {
  private AnonymizationConfigurationMapper() {}

  public static AnonymizationConfiguration mapToPersistence(
      DataPrivacyCategory dataPrivacyCategory,
      Integer lDiversity,
      Double tCloseness,
      IntervalConfiguration intervalConfiguration) {
    if (dataPrivacyCategory == null) {
      return null;
    }
    AnonymizationConfiguration anonymizationConfiguration = new AnonymizationConfiguration();
    anonymizationConfiguration.setDataPrivacyCategory(
        TableColumnDataPrivacyCategory.valueOf(dataPrivacyCategory.name()));
    anonymizationConfiguration.setLDiversity(lDiversity);
    anonymizationConfiguration.setTCloseness(
        tCloseness == null ? null : BigDecimal.valueOf(tCloseness));

    if (intervalConfiguration != null) {
      mapIntervalConfiguration(intervalConfiguration, anonymizationConfiguration);
    }

    return anonymizationConfiguration;
  }

  private static void mapIntervalConfiguration(
      IntervalConfiguration intervalConfiguration,
      AnonymizationConfiguration anonymizationConfiguration) {
    switch (intervalConfiguration) {
      case DecimalIntervalBordersConfiguration decimalIntervalBordersConfiguration ->
          anonymizationConfiguration.setDecimalBorders(
              decimalIntervalBordersConfiguration.intervalBorders().stream()
                  .map(BigDecimal::valueOf)
                  .toList());
      case DecimalMinMaxCountIntervalConfiguration decimalMinMaxCountIntervalConfiguration -> {
        anonymizationConfiguration.setIntervalCount(
            decimalMinMaxCountIntervalConfiguration.countIntervals());
        anonymizationConfiguration.setMinDecimalInclusive(
            BigDecimal.valueOf(decimalMinMaxCountIntervalConfiguration.minInclusive()));
        anonymizationConfiguration.setMaxDecimalInclusive(
            BigDecimal.valueOf(decimalMinMaxCountIntervalConfiguration.maxInclusive()));
      }
      case IntegerIntervalBordersConfiguration integerIntervalBordersConfiguration ->
          anonymizationConfiguration.setIntegerBorders(
              integerIntervalBordersConfiguration.intervalBorders());
      case IntegerMinMaxCountIntervalConfiguration integerMinMaxCountIntervalConfiguration -> {
        anonymizationConfiguration.setIntervalCount(
            integerMinMaxCountIntervalConfiguration.countIntervals());
        anonymizationConfiguration.setMinIntegerInclusive(
            integerMinMaxCountIntervalConfiguration.minInclusive());
        anonymizationConfiguration.setMaxIntegerInclusive(
            integerMinMaxCountIntervalConfiguration.maxInclusive());
      }
    }
  }
}
