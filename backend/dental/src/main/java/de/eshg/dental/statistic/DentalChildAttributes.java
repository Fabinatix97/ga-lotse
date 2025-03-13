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
      new ProcedureAttribute(
          "Vorgangsreferenz", DentalChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      new CentralFileIdPersonAttribute(
          "Kind", "CHILD_CENTRAL_FILE_ID", DentalChildAttributes.CATEGORY_CHILD, true)),

  EINRICHTUNG(
      new ContactIdAttribute(
          "Einrichtung", "EINRICHTUNG", DentalChildAttributes.CATEGORY_CHILD, true)),

  GRUPPE(
      new ValueWithOptionsAttribute(
          "Gruppe",
          "GRUPPE",
          convertToValueOptions(Group.values()),
          DentalChildAttributes.CATEGORY_CHILD,
          true)),

  ANZAHL_PROPHYLAXEN(
      new IntegerAttribute(
          "Anzahl Prophylaxeimpulse",
          "ANZAHL_PROPHYLAXEN",
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  MUNDHYGIENE_STATUS(
      new ValueWithOptionsAttribute(
          "Mundhygienestatus",
          "MUNDHYGIENE_STATUS",
          convertToValueOptions(OralHygieneStatus.values()),
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  MIH_STATUS(
      new ValueWithOptionsAttribute(
          "MIH-Status",
          "MIH_STATUS",
          convertToValueOptions(MihStatus.values()),
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),

  DMFT_MILCH(
      new IntegerAttribute(
          "dmft-t", "DMFT_MILCH", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),

  DMFT_BLEIBEND(
      new IntegerAttribute(
          "DMF-T", "DMFT_BLEIBEND", DentalChildAttributes.CATEGORY_PROPHYLAXIS, true)),

  KARIES_RISIKO(
      new BooleanAttribute(
          "Kariesrisiko", "KARIES_RISIKO", DentalChildAttributes.CATEGORY_PROPHYLAXIS, false)),

  KARIES_STATUS(
      new ValueWithOptionsAttribute(
          "Kariesstatus",
          "KARIES_STATUS",
          convertToValueOptions(DecayStatus.values()),
          DentalChildAttributes.CATEGORY_PROPHYLAXIS,
          true)),
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
