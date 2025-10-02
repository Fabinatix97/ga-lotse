/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.dental.statistic.model.DecayStatus;
import de.eshg.dental.statistic.model.Group;
import de.eshg.dental.statistic.model.MihStatus;
import de.eshg.dental.statistic.model.OralHygieneStatus;
import de.eshg.lib.statistics.attributes.*;

public enum DentalChildAttributes implements AttributeInfo {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", DentalChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Kind", "CHILD_CENTRAL_FILE_ID", DentalChildAttributes.CATEGORY_CHILD, true)),

  CHILD_AGE(
      IntegerAttribute.create(
          "Alter bei letzter Reihenuntersuchung",
          "ALTER",
          DentalChildAttributes.CATEGORY_CHILD,
          true)),

  SCHULJAHR(
      TextAttribute.create("Schuljahr", "SCHULJAHR", DentalChildAttributes.CATEGORY_CHILD, true)),

  EINRICHTUNG(
      ContactIdAttribute.create(
          "Einrichtung", "EINRICHTUNG", DentalChildAttributes.CATEGORY_CHILD, true)),

  GRUPPE(
      ValueWithOptionsAttribute.create(
          "Gruppe",
          "GRUPPE",
          DentalChildAttributes.CATEGORY_CHILD,
          true,
          convertToValueOptions(Group.values()))),

  ANZAHL_MASSNAHMEN(
      IntegerAttribute.create(
          "Anzahl Maßnahmen",
          "ANZAHL_MASSNAHMEN",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  MUNDHYGIENE_STATUS(
      ValueWithOptionsAttribute.create(
          "Mundhygienestatus",
          "MUNDHYGIENE_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(OralHygieneStatus.values()))),

  MIH_STATUS(
      ValueWithOptionsAttribute.create(
          "MIH/MMH-Status",
          "MIH_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(MihStatus.values()))),

  DMFT_MILCH(
      IntegerAttribute.create(
          "dmf-t Milch", "DMFT_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),

  DMFT_BLEIBEND(
      IntegerAttribute.create(
          "DMF-T Bleibend", "DMFT_BLEIBEND", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),

  KARIES_RISIKO(
      BooleanAttribute.create(
          "Kariesrisiko", "KARIES_RISIKO", DentalChildAttributes.CATEGORY_PROPHYLAXIS, false)),

  KARIES_STATUS(
      ValueWithOptionsAttribute.create(
          "Kariesstatus",
          "KARIES_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(DecayStatus.values()))),

  SANIERUNGSGRAD_MILCH(
      DecimalAttribute.create(
          "Sanierungsgrad Milch",
          "SANIERUNGSGRAD_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  SANIERUNGSGRAD_BLEIBEND(
      DecimalAttribute.create(
          "Sanierungsgrad Bleibend",
          "SANIERUNGSGRAD_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  HYPOPLASIE_MILCH(
      IntegerAttribute.create(
          "Hypoplasie Anzahl Milch",
          "HYPOPLASIE_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),
  HYPOPLASIE_BLEIBEND(
      IntegerAttribute.create(
          "Hypoplasie Anzahl Bleibend",
          "HYPOPLASIE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  INITIALKARIES_MILCH(
      IntegerAttribute.create(
          "Initialkaries Anzahl Milch",
          "INITIALKARIES_MILCH",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),
  INITIALKARIES_BLEIBEND(
      IntegerAttribute.create(
          "Initialkaries Anzahl Bleibend",
          "INITIALKARIES_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  D_WERTE_MILCH(
      IntegerAttribute.create(
          "D-Werte Milch", "D_WERTE_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),
  D_WERTE_BLEIBEND(
      IntegerAttribute.create(
          "D-Werte Bleibend",
          "D_WERTE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  M_WERTE_MILCH(
      IntegerAttribute.create(
          "M-Werte Milch", "M_WERTE_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),
  M_WERTE_BLEIBEND(
      IntegerAttribute.create(
          "M-Werte Bleibend",
          "M_WERTE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  F_WERTE_MILCH(
      IntegerAttribute.create(
          "F-Werte Milch", "F_WERTE_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),
  F_WERTE_BLEIBEND(
      IntegerAttribute.create(
          "F-Werte Bleibend",
          "F_WERTE_BLEIBEND",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),
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
