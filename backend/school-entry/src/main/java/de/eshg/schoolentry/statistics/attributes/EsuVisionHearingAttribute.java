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
      ValueWithOptionsAttribute.create(
          "Ergebnis Sehscreening",
          "VISCH",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  KW_RM_VISUS(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Sehscreening",
          "KW_RM_VISUS",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  KW_AMBLYOPIE(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung Amblyopie",
          "KW_AMBLYOPIE",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(Diagnosis.values()))),

  KW_ASTIGMATISMUS(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung Astigmatismus",
          "KW_ASTIGMATISMUS",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()))),

  KW_STOER_FARBS(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung Farbsinnstörung",
          "KW_STOER_FARBS",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()))),

  KW_HYPEROPIE(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung Hyperopie",
          "KW_HYPEROPIE",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()))),

  KW_MYOPIE(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung Myopie",
          "KW_MYOPIE",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()))),

  KW_STRABISM(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung Strabismus",
          "KW_STRABISM",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()))),

  KW_AND_DIAGN(
      ValueWithOptionsAttribute.create(
          "Diagnose Rückmeldung andere Diagnose",
          "KW_AND_DIAGN",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(Diagnosis.values()))),

  VISTR(
      ValueWithOptionsAttribute.create(
          "Ergebnis Stereosehen, Langtest",
          "VISTR",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  KW_RM_VISTR(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Stereosehen",
          "KW_RM_VISTR",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  FARB(
      ValueWithOptionsAttribute.create(
          "Ergebnis Ishiharatest Farbsinn",
          "FARB",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  KW_RM_FARB(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Farbsinn",
          "KW_RM_FARB",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  AUDIO(
      ValueWithOptionsAttribute.create(
          "Ergebnis Hörscreening",
          "AUDIO",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  KW_RM_AUDIO(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Hörscreening",
          "KW_RM_AUDIO",
          EsuVisionHearingAttribute.CATEGORY_VISION_HEARING,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),
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
