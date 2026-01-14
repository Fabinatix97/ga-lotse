/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;
import static de.eshg.schoolentry.statistics.attributes.EsuAttributeUtil.UNKNOWN_DECIMAL_99_9;
import static de.eshg.schoolentry.statistics.attributes.EsuAttributeUtil.UNKNOWN_INTEGER_999;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.DecimalAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuDevelopmentScreeningAttribute implements EsuAttributes {
  KIND(
      ValueWithOptionsAttribute.create(
          "Status Kind",
          "KIND",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(Child.values()),
          DataPrivacyCategory.INSENSITIVE)),

  GROE(
      DecimalAttribute.createSensitive(
          "Größe",
          "GROE",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "m",
          EsuAttributeUtil.createUnknownOption(Integer.toString(UNKNOWN_INTEGER_999)),
          new SensitiveParameters(2, null))),

  GROE_PERZ(
      DecimalAttribute.createSensitive(
          "Größe_Perzentile",
          "GROE_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          null,
          null,
          new SensitiveParameters(2, null))),

  GEWI(
      DecimalAttribute.createSensitive(
          "Gewicht",
          "GEWI",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "kg",
          EsuAttributeUtil.createUnknownOption(Double.toString(UNKNOWN_DECIMAL_99_9)),
          new SensitiveParameters(2, null))),

  GEWI_PERZ(
      DecimalAttribute.createSensitive(
          "Gewicht_Perzentile",
          "GEWI_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          null,
          null,
          new SensitiveParameters(2, null))),

  BMI(
      DecimalAttribute.createSensitive(
          "BMI",
          "BMI",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          null,
          null,
          new SensitiveParameters(2, null))),

  BMI_PERZ(
      DecimalAttribute.createSensitive(
          "BMI_Perzentile",
          "BMI_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          null,
          null,
          new SensitiveParameters(2, null))),

  RRSYS(
      IntegerAttribute.createSensitive(
          "RR_systolisch",
          "RRSYS",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "mmHG",
          EsuAttributeUtil.createUnknownOption("999"),
          new SensitiveParameters(2, null))),

  RRDIA(
      IntegerAttribute.createSensitive(
          "RR_diastolisch",
          "RRDIA",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "mmHG",
          EsuAttributeUtil.createUnknownOption("999"),
          new SensitiveParameters(2, null))),

  KOERPERCHECK(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis körperliche Untersuchung",
          "KOERPERCHECK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(PhysicalExaminationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  EZ(
      ValueWithOptionsAttribute.createSensitive(
          "Ernährungszustand",
          "EZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_ERNAEHRUNGSZUSTAND(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Ernährungszustand",
          "RM Ernährungszustand",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  NEU(
      ValueWithOptionsAttribute.createSensitive(
          "Neuro",
          "NEU",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_NEUROLOGIE(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Neurologie",
          "RM Neurologie",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  AHK(
      ValueWithOptionsAttribute.createSensitive(
          "Atmung-Herz-Kreislauf",
          "AHK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_ATMUNG_HERZ_KREISLAUF(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Atmung-Herz-Kreislauf",
          "RM Atmung-Herz-Kreislauf",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DERM(
      ValueWithOptionsAttribute.createSensitive(
          "Hautzustand",
          "DERM",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_HAUT(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Haut",
          "RM Haut",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  MUSK(
      ValueWithOptionsAttribute.createSensitive(
          "Muskulatur",
          "MUSK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_MUSKULATUR_SKELETT(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Muskulatur,Skelett",
          "RM Muskulatur,Skelett",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  ENDO(
      ValueWithOptionsAttribute.createSensitive(
          "Endo/Stoffwechsel",
          "ENDO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_ENDO_STOFFW(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Endo/Stoffwechsel",
          "RM Endo/Stoffw.",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  ABD(
      ValueWithOptionsAttribute.createSensitive(
          "Abdomen",
          "ABD",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_ABDOMEN(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Abdomen",
          "RM Abdomen",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  HNO(
      ValueWithOptionsAttribute.createSensitive(
          "Hals-Nasen-Ohren",
          "HNO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  RM_HNO(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief HNO",
          "RM HNO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  HANDCAP(
      BooleanAttribute.createSensitive(
          "Handicap", "HANDCAP", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  CHKR(
      BooleanAttribute.createSensitive(
          "chronische Krankheit",
          "CHKR",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  DIAGCH1(
      TextAttribute.create(
          "Diagnose 1, chron. Krankheit",
          "DIAGCH1",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  DIAGCH2(
      TextAttribute.create(
          "Diagnose 2, chron. Krankheit",
          "DIAGCH2",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  DIAGCH3(
      TextAttribute.create(
          "Diagnose 3, chron. Krankheit",
          "DIAGCH3",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  BEHI(
      BooleanAttribute.createSensitive(
          "Behinderung", "BEHI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  BEHIART(
      ValueWithOptionsAttribute.createSensitive(
          "Art der Behinderung",
          "BEHIART",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(Disability.values()),
          new SensitiveParameters(2, null),
          null)),

  DIAGB1(
      TextAttribute.create(
          "Diagnose 1, Behinderung",
          "DIAGB1",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  DIAGB2(
      TextAttribute.create(
          "Diagnose 2, Behinderung",
          "DIAGB2",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  DIAGB3(
      TextAttribute.create(
          "Diagnose 3, Behinderung",
          "DIAGB3",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  PSYSOZRISK(
      BooleanAttribute.createSensitive(
          "Psychosoziales Risiko",
          "PSYSOZRISK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  FAMILIE(
      BooleanAttribute.createSensitive(
          "Familie", "Familie", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  NONCOMP(
      BooleanAttribute.createSensitive(
          "Non-Compliance",
          "NonComp",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  SOZIAL(
      BooleanAttribute.createSensitive(
          "Sozial", "Sozial", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  MIGRATION(
      BooleanAttribute.createSensitive(
          "Migration",
          "Migration",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  SONSTIGES_RISIKO(
      BooleanAttribute.createSensitive(
          "Sonstiges Risiko",
          "Sonstiges Risiko",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  MASSN(
      BooleanAttribute.createSensitive(
          "sozialpädiatrische Leistung",
          "MASSN",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  WSPR(
      BooleanAttribute.createSensitive(
          "Wiedervorstellung in Sprechstunde",
          "WSPR",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  SCHB(
      BooleanAttribute.createSensitive(
          "Schulberatung", "SCHB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  MOTO(
      BooleanAttribute.createSensitive(
          "Motorikförderung",
          "MOTO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  ERZB(
      BooleanAttribute.createSensitive(
          "Erziehungsberatung",
          "ERZB",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  SPRF(
      BooleanAttribute.createSensitive(
          "Sprachförderung",
          "SPRF",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  ERNB(
      BooleanAttribute.createSensitive(
          "Ernährungsberatung",
          "ERNB",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  IMPF(
      BooleanAttribute.createSensitive(
          "Impfberatung", "IMPF", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  SOZD(
      BooleanAttribute.createSensitive(
          "Sozialdienst", "SOZD", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  SOHI(
      BooleanAttribute.createSensitive(
          "sonstige Hilfen",
          "SOHI",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          0.2)),

  INFO(
      BooleanAttribute.createSensitive(
          "Infobrief", "INFO", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),

  SCHULEMPF(
      ValueWithOptionsAttribute.createSensitive(
          "Schulempfehlung",
          "SCHULEMPF",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(SchoolRecommendation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  MEHR(
      BooleanAttribute.createSensitive(
          "Mehraufwand", "MEHR", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true, 0.2)),
  ;

  private static final String CATEGORY_S1_RESULT = "S1-Befund";

  private final AttributeData attribute;

  EsuDevelopmentScreeningAttribute(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
