/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuVisionHearingAttribute implements EsuAttributes {
  VISCH(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Sehscreening",
          "VISCH",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_VISUS(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Sehscreening",
          "KW_RM_VISUS",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_AMBLYOPIE(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung Amblyopie",
          "KW_AMBLYOPIE",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_ASTIGMATISMUS(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung Astigmatismus",
          "KW_ASTIGMATISMUS",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_STOER_FARBS(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung Farbsinnstörung",
          "KW_STOER_FARBS",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_HYPEROPIE(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung Hyperopie",
          "KW_HYPEROPIE",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_MYOPIE(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung Myopie",
          "KW_MYOPIE",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_STRABISM(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung Strabismus",
          "KW_STRABISM",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_AND_DIAGN(
      ValueWithOptionsAttribute.createSensitive(
          "Diagnose Rückmeldung andere Diagnose",
          "KW_AND_DIAGN",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  VISTR(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Stereosehen, Langtest",
          "VISTR",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_VISTR(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Stereosehen",
          "KW_RM_VISTR",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  FARB(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Ishiharatest Farbsinn",
          "FARB",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_FARB(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Farbsinn",
          "KW_RM_FARB",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  AUDIO(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Hörscreening",
          "AUDIO",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_AUDIO(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Hörscreening",
          "KW_RM_AUDIO",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),
  ;

  private static final String CATEGORY_VISION_HEARING = "Seh- und Hörscreening";

  private final AttributeData attribute;

  EsuVisionHearingAttribute(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
