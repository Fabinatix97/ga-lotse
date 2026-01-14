/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.statistics;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
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
                    entry.name(), entry.getGermanName(), entry == YesNoDontKnowAnswerDto.DONT_KNOW))
        .toList();
  }

  public static List<ValueOptionInternal> opticalAidAnswerValueOptions() {
    return Arrays.stream(OpticalAidAnswerDto.values())
        .map(entry -> new ValueOptionInternal(entry.name(), entry.name(), false))
        .toList();
  }

  public static String germanNameForProcedureStatus(ProcedureStatus procedureStatus) {
    if (procedureStatus == null) {
      return null;
    }
    return switch (procedureStatus) {
      case DRAFT -> "Entwurf";
      case OPEN -> "Offen";
      case IN_PROGRESS -> "In Arbeit";
      case CLOSED -> "Geschlossen";
      case ABORTED -> "Abgebrochen";
    };
  }
}
