/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.consultation.Consultation;
import de.eshg.stiprotection.persistence.db.consultation.GeneralSection;

public enum StiConsultationAttributes implements StiAttributes {
  CONSULTATION_HEALTH_INSURANCE(
      BooleanAttribute.createSensitive(
          "Krankenversichert",
          "CONSULTATION_HEALTH_INSURANCE",
          StiConsultationAttributes.CONSULTATION_CATEGORY,
          false,
          0.2)),

  CONSULTATION_GERMAN_HEALTH_INSURANCE(
      BooleanAttribute.createSensitive(
          "In Deutschland krankenversichert",
          "CONSULTATION_GERMAN_HEALTH_INSURANCE",
          StiConsultationAttributes.CONSULTATION_CATEGORY,
          false,
          0.2)),

  CONSULTATION_INSECURE_RESIDENCE(
      BooleanAttribute.createSensitive(
          "Unsicherer Aufenthalt",
          "CONSULTATION_INSECURE_RESIDENCE",
          StiConsultationAttributes.CONSULTATION_CATEGORY,
          false,
          0.2));

  private static final String CONSULTATION_CATEGORY = "Konsultation";

  private final AttributeData attribute;

  StiConsultationAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiConsultationAttributes attribute) {
    Consultation consultation = procedure.getConsultation();
    if (consultation == null) {
      return null;
    }

    GeneralSection general = consultation.getGeneral();
    if (general == null) {
      return null;
    }

    return switch (attribute) {
      case CONSULTATION_HEALTH_INSURANCE -> general.getHasHealthInsurance();
      case CONSULTATION_GERMAN_HEALTH_INSURANCE -> general.getHasGermanHealthInsurance();
      case CONSULTATION_INSECURE_RESIDENCE -> general.getHasInsecureResidence();
    };
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
