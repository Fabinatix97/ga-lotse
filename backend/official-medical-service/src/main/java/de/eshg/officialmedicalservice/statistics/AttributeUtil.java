/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.statistics;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto.OpticalAidAnswerDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.YesNoDontKnowAnswerDto;
import java.util.Arrays;
import java.util.List;

class AttributeUtil {

  static final String ATTRIBUTE_CATEGORY_PROCEDURE = "Vorgang";
  static final String ATTRIBUTE_CATEGORY_ANAMNESIS = "Anamnese";

  private AttributeUtil() {}

  public static List<ValueOptionInternal> yesNoDontKnowAnswerValueOptions() {
    return Arrays.stream(YesNoDontKnowAnswerDto.values())
        .map(
            entry ->
                new ValueOptionInternal(
                    entry.name(), entry.name(), entry == YesNoDontKnowAnswerDto.DONT_KNOW))
        .toList();
  }

  public static List<ValueOptionInternal> opticalAidAnswerValueOptions() {
    return Arrays.stream(OpticalAidAnswerDto.values())
        .map(entry -> new ValueOptionInternal(entry.name(), entry.name(), false))
        .toList();
  }
}
