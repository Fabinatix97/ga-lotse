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
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.ContactIdAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;

public enum DentalChildAttributes implements AttributeInfo {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", DentalChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Kind", "CHILD_CENTRAL_FILE_ID", DentalChildAttributes.CATEGORY_CHILD, true)),

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

  ANZAHL_PROPHYLAXEN(
      IntegerAttribute.create(
          "Anzahl Prophylaxeimpulse",
          "ANZAHL_PROPHYLAXEN",
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
          "MIH-Status",
          "MIH_STATUS",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true,
          convertToValueOptions(MihStatus.values()))),

  DMFT_MILCH(
      IntegerAttribute.create(
          "dmft-t", "DMFT_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),

  DMFT_BLEIBEND(
      IntegerAttribute.create(
          "DMF-T", "DMFT_BLEIBEND", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),

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
  ;

  static final String CATEGORY_CHILD = "Kind";
  static final String CATEGORY_PROPHYLAXIS = "Prophylaxe";
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
