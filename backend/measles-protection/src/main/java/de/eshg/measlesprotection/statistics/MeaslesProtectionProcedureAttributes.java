/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.statistics;

import static de.eshg.measlesprotection.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_PROCEDURE;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.DateAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.measlesprotection.persistence.db.ReportingReason;
import java.util.Arrays;

public enum MeaslesProtectionProcedureAttributes implements AttributeInfo {
  PROCEDURE_ID(ProcedureAttribute.create("Vorgangsreferenz", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  PERSON_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Person", "PERSON_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  FACILITY_CENTRAL_FILE_ID(
      CentralFileIdFacilityAttribute.create(
          "Einrichtung", "FACILITY_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  REPORTING_DATE(
      DateAttribute.create(
          "Meldedatum",
          "REPORTING_DATE",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true,
          null,
          DataPrivacyCategory.INSENSITIVE)),
  REPORTING_REASON(
      ValueWithOptionsAttribute.create(
          "Meldegrund",
          "REPORTING_REASON",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true,
          Arrays.stream(ReportingReason.values())
              .map(entry -> new ValueOptionInternal(entry.name(), entry.getGermanName(), false))
              .toList())),
  CURRENT_ACCESS_RESTRICTION(
      BooleanAttribute.create(
          "Erteiltes Betretungsverbot",
          "CURRENT_ACCESS_RESTRICTION",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),
  TERMINATED_ACCESS_RESTRICTION(
      BooleanAttribute.create(
          "Aufgehobenes Betretungsverbot",
          "TERMINATED_ACCESS_RESTRICTION",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),
  VALID_PROOF_SUBMISSION(
      BooleanAttribute.create(
          "Gültige Nachweisvorlage", "VALID_PROOF_SUBMISSION", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  PERMANENT_CONTRA_INDICATION(
      BooleanAttribute.create(
          "Dauerhafte Kontraindikation",
          "PERMANENT_CONTRA_INDICATION",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),
  ;

  private final AttributeData attribute;

  MeaslesProtectionProcedureAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
