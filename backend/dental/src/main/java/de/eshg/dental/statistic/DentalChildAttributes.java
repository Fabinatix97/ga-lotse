/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.dental.statistic.model.DecayStatus;
import de.eshg.dental.statistic.model.Group;
import de.eshg.dental.statistic.model.MihStatus;
import de.eshg.dental.statistic.model.OralHygieneStatus;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.attributes.*;

public enum DentalChildAttributes implements AttributeInfo {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", DentalChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Kind", "CHILD_CENTRAL_FILE_ID", DentalChildAttributes.CATEGORY_CHILD, true)),

  CHILD_AGE(
      IntegerAttribute.createQuasiIdentifying(
          "Alter bei letzter Reihenuntersuchung",
          "ALTER",
          DentalChildAttributes.CATEGORY_CHILD,
          true,
          null,
          null,
          new IntegerMinMaxCountIntervalConfiguration(1, 18, 6))),

  SCHULJAHR(
      TextAttribute.create(
          "Schuljahr",
          "SCHULJAHR",
          DentalChildAttributes.CATEGORY_CHILD,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  EINRICHTUNG(
      ContactIdAttribute.create(
          "Einrichtung", "EINRICHTUNG", DentalChildAttributes.CATEGORY_CHILD, true)),

  GRUPPE(
      ValueWithOptionsAttribute.create(
          "Gruppe",
          "GRUPPE",
          DentalChildAttributes.CATEGORY_CHILD,
          true,
          convertToValueOptions(Group.values()),
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  ANZAHL_MASSNAHMEN(
      IntegerAttribute.createInsensitive(
          "Anzahl Maßnahmen",
          "ANZAHL_MASSNAHMEN",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null)),

  MUNDHYGIENE_STATUS(
      ValueWithOptionsAttribute.createSensitive(
          "Mundhygienestatus",
          "MUNDHYGIENE_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(OralHygieneStatus.values()),
          new SensitiveParameters(2, null),
          null)),

  MIH_STATUS(
      ValueWithOptionsAttribute.createSensitive(
          "MIH/MMH-Status",
          "MIH_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(MihStatus.values()),
          new SensitiveParameters(2, null),
          null)),

  DMFT_MILCH(
      IntegerAttribute.createSensitive(
          "dmf-t Milch",
          "DMFT_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  DMFT_BLEIBEND(
      IntegerAttribute.createSensitive(
          "DMF-T Bleibend",
          "DMFT_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  KARIES_HOCH_RISIKO(
      BooleanAttribute.createSensitive(
          "Karieshochrisiko",
          "KARIES_HOCH_RISIKO",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          false,
          0.2)),

  KARIES_STATUS(
      ValueWithOptionsAttribute.createSensitive(
          "Kariesstatus",
          "KARIES_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(DecayStatus.values()),
          new SensitiveParameters(2, null),
          null)),

  SANIERUNGSGRAD_MILCH(
      DecimalAttribute.createSensitive(
          "Sanierungsgrad Milch",
          "SANIERUNGSGRAD_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  SANIERUNGSGRAD_BLEIBEND(
      DecimalAttribute.createSensitive(
          "Sanierungsgrad Bleibend",
          "SANIERUNGSGRAD_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  HYPOPLASIE_MILCH(
      IntegerAttribute.createSensitive(
          "Hypoplasie Anzahl Milch",
          "HYPOPLASIE_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),
  HYPOPLASIE_BLEIBEND(
      IntegerAttribute.createSensitive(
          "Hypoplasie Anzahl Bleibend",
          "HYPOPLASIE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  INITIALKARIES_MILCH(
      IntegerAttribute.createSensitive(
          "Initialkaries Anzahl Milch",
          "INITIALKARIES_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),
  INITIALKARIES_BLEIBEND(
      IntegerAttribute.createSensitive(
          "Initialkaries Anzahl Bleibend",
          "INITIALKARIES_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  D_WERTE_MILCH(
      IntegerAttribute.createSensitive(
          "D-Werte Milch",
          "D_WERTE_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),
  D_WERTE_BLEIBEND(
      IntegerAttribute.createSensitive(
          "D-Werte Bleibend",
          "D_WERTE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  M_WERTE_MILCH(
      IntegerAttribute.create(
          "M-Werte Milch", "M_WERTE_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),
  M_WERTE_BLEIBEND(
      IntegerAttribute.createSensitive(
          "M-Werte Bleibend",
          "M_WERTE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),

  F_WERTE_MILCH(
      IntegerAttribute.createSensitive(
          "F-Werte Milch",
          "F_WERTE_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),
  F_WERTE_BLEIBEND(
      IntegerAttribute.createSensitive(
          "F-Werte Bleibend",
          "F_WERTE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          null,
          null,
          new SensitiveParameters(null, 0.2))),
  ;

  static final String CATEGORY_CHILD = "Kind";
  static final String CATEGORY_PROPHYLAXIS = "Maßnahme";
  static final String CATEGORY_PROCEDURE_REFERENCE = "Vorgangsreferenz";

  private final AttributeData attribute;

  DentalChildAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
