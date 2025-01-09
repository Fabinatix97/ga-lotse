/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuVisionHearingAttribute implements EsuAttributes {
  VISCH(
      new ValueWithOptionsAttribute(
          "Ergebnis Sehscreening",
          "VISCH",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true)),

  KW_RM_VISUS(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Sehscreening",
          "KW_RM_VISUS",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  KW_AMBLYOPIE(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung Amblyopie",
          "KW_AMBLYOPIE",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true)),

  KW_ASTIGMATISMUS(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung Astigmatismus",
          "KW_ASTIGMATISMUS",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  KW_STOER_FARBS(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung Farbsinnstörung",
          "KW_STOER_FARBS",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  KW_HYPEROPIE(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung Hyperopie",
          "KW_HYPEROPIE",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  KW_MYOPIE(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung Myopie",
          "KW_MYOPIE",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  KW_STRABISM(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung Strabismus",
          "KW_STRABISM",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  KW_AND_DIAGN(
      new ValueWithOptionsAttribute(
          "Diagnose Rückmeldung andere Diagnose",
          "KW_AND_DIAGN",
          convertToValueOptions(Diagnosis.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  VISTR(
      new ValueWithOptionsAttribute(
          "Ergebnis Stereosehen, Langtest",
          "VISTR",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true)),

  KW_RM_VISTR(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Stereosehen",
          "KW_RM_VISTR",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  FARB(
      new ValueWithOptionsAttribute(
          "Ergebnis Ishiharatest Farbsinn",
          "FARB",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true)),

  KW_RM_FARB(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Farbsinn",
          "KW_RM_FARB",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),

  AUDIO(
      new ValueWithOptionsAttribute(
          "Ergebnis Hörscreening",
          "AUDIO",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true)),

  KW_RM_AUDIO(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Hörscreening",
          "KW_RM_AUDIO",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false)),
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
