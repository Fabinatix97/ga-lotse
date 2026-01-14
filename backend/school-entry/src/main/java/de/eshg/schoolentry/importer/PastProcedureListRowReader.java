/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_FIRST_NAME_LENGTH;
import static de.eshg.base.gdpr.api.GdprPersonDto.MAX_LAST_NAME_LENGTH;
import static de.eshg.schoolentry.importer.PastProcedureListColumn.*;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.api.CountryCodeDto;
import de.eshg.schoolentry.business.model.*;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.mapper.AnamnesisMapper;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.BiConsumer;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.data.domain.Range;

class PastProcedureListRowReader extends RowReader<PastProcedureListRow, PastProcedureListColumn> {

  private static final String DATE_FORMAT = "^\\d{2}\\.\\d{4}$";

  static final List<PastProcedureListColumn> DISABILITY_ICD10_COLUMNS =
      List.of(DISABILITY_ICD10_1, DISABILITY_ICD10_2, DISABILITY_ICD10_3);

  static final List<PastProcedureListColumn> CHRONIC_DISEASE_ICD10_COLUMNS =
      List.of(CHRONIC_DISEASE_ICD10_1, CHRONIC_DISEASE_ICD10_2, CHRONIC_DISEASE_ICD10_3);

  PastProcedureListRowReader(
      Sheet sheet, Clock clock, List<PastProcedureListColumn> actualColumns) {
    super(sheet, actualColumns, PastProcedureListRow::new, clock);
  }

  @Override
  protected void read(
      PastProcedureListRow result,
      ColumnAccessor<PastProcedureListColumn> col,
      ErrorHandler errorHandler) {
    result.setChild(readChildData(col, errorHandler));
    result.setProcedureType(readProcedureType(col, errorHandler));
    LocalDate examinationDate = cellAsDate(col, EXAMINATION_DATE, errorHandler);
    result.setExaminationDate(examinationDate);
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setEntityId(readUuid(col, PROCEDURE_ID, errorHandler));
    result.setAnamnesis(readAnamnesis(col, errorHandler, examinationDate));
    result.setVaccinationStatus(readVaccinationStatus(col, errorHandler));
    result.setEyeExaminationResult(readEyeExamination(col, errorHandler));
    result.setHearingTest(readHearingTest(col, errorHandler));
    result.setSopessExamination(readSopessExamination(col, errorHandler));
    result.setDevelopmentScreening(readDevelopmentScreening(col, errorHandler));
  }

  private Anamnesis readAnamnesis(
      ColumnAccessor<PastProcedureListColumn> col,
      ErrorHandler errorHandler,
      LocalDate examinationDate) {
    Anamnesis anamnesis = new Anamnesis();
    anamnesis.setNumberOfSiblings(readIntegerInRange(col, SIBLINGS, errorHandler, 0, 15, 99));
    anamnesis.setNationalityChild(readCountryGroupCode(col, NATIONALITY_CHILD, errorHandler));
    anamnesis.setCountryOfBirthChild(
        readCountryGroupCode(col, COUNTRY_OF_BIRTH_CHILD, errorHandler));
    anamnesis.setNationalityFirstParent(readCountryGroupCode(col, NATIONALITY_P1, errorHandler));
    anamnesis.setCountryOfBirthFirstParent(
        readCountryGroupCode(col, COUNTRY_OF_BIRTH_P1, errorHandler));
    anamnesis.setNationalitySecondParent(readCountryGroupCode(col, NATIONALITY_P2, errorHandler));
    anamnesis.setCountryOfBirthSecondParent(
        readCountryGroupCode(col, COUNTRY_OF_BIRTH_P2, errorHandler));
    anamnesis.setHasMigrationBackground(cellAsBoolean(col, MIGRATION_BACKGROUND, errorHandler));
    Integer daycareValue = readIntegerInRange(col, DAYCARE, errorHandler, 0, 3, 9);
    anamnesis.setWasInDaycare(mapToWasInDaycare(daycareValue));
    anamnesis.setInDaycareSince(approximateInDaycareSince(daycareValue, examinationDate));
    anamnesis.setPreliminaryCourse(
        cellAsBooleanWithFallbackFalse(col, PRELIMINARY_COURSE, errorHandler));
    anamnesis.setBirthWeight(readIntegerInRange(col, BIRTH_WEIGHT, errorHandler, 300, 6000, 9999));
    anamnesis.setIntegrationPlace(
        cellAsBooleanWithFallbackFalse(col, INTEGRATION_PLACE, errorHandler));
    anamnesis.setEarlySupport(cellAsBooleanWithFallbackFalse(col, EARLY_SUPPORT, errorHandler));
    anamnesis.setErgotherapy(cellAsBooleanWithFallbackFalse(col, ERGO_THERAPY, errorHandler));
    anamnesis.setSpeechTherapy(cellAsBooleanWithFallbackFalse(col, SPEECH_THERAPY, errorHandler));
    anamnesis.setPhysiotherapy(cellAsBooleanWithFallbackFalse(col, PHYSIO_THERAPY, errorHandler));
    anamnesis.setChildLanguageScreening(
        cellAsBooleanWithFallbackFalse(col, CHILD_LANGUAGE_SCREENING, errorHandler));
    anamnesis.setU2(readBooleanWithUnknown(col, U2, errorHandler));
    anamnesis.setU3(readBooleanWithUnknown(col, U3, errorHandler));
    anamnesis.setU4(readBooleanWithUnknown(col, U4, errorHandler));
    anamnesis.setU5(readBooleanWithUnknown(col, U5, errorHandler));
    anamnesis.setU6(readBooleanWithUnknown(col, U6, errorHandler));
    anamnesis.setU7(readBooleanWithUnknown(col, U7, errorHandler));
    anamnesis.setU7a(readBooleanWithUnknown(col, U7A, errorHandler));
    anamnesis.setU8(readBooleanWithUnknown(col, U8, errorHandler));
    anamnesis.setU9(readBooleanWithUnknown(col, U9, errorHandler));
    return anamnesis;
  }

  private static LocalDate approximateInDaycareSince(
      Integer daycareValue, LocalDate examinationDate) {
    if (daycareValue == null || examinationDate == null) {
      return null;
    }

    return switch (daycareValue) {
      case 1 -> examinationDate.minus(Period.ofMonths(9));
      case 2 -> examinationDate.minus(Period.ofMonths(27));
      case 3 -> examinationDate.minus(Period.ofMonths(45));
      default -> null;
    };
  }

  private static Boolean mapToWasInDaycare(Integer daycareValue) {
    return switch (daycareValue) {
      case 0 -> false;
      case 1, 2, 3 -> true;
      case null, default -> null;
    };
  }

  private static BooleanWithUnknown readBooleanWithUnknown(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String booleanString = cellAsString(cell, true, false, errorHandler);
    if (booleanString == null) {
      return BooleanWithUnknown.UNKNOWN;
    }

    return switch (booleanString.toUpperCase()) {
      case "JA" -> BooleanWithUnknown.TRUE;
      case "NEIN" -> BooleanWithUnknown.FALSE;
      default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Ja, Nein oder leere Zelle. Tatsächlich: %s)"
                .formatted(booleanString));
        yield null;
      }
    };
  }

  private SchoolEntryCountryCode readCountryGroupCode(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    Integer groupCode = readIntegerInRange(col, column, errorHandler, 0, 9);
    if (groupCode == null) {
      return null;
    }
    return AnamnesisMapper.mapToDomain(CountryCodeDto.getCountryGroup(groupCode));
  }

  private VaccinationStatus readVaccinationStatus(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    VaccinationStatus vaccinationStatus = new VaccinationStatus();
    vaccinationStatus.setVaccinationScheme(readVaccinationScheme(col, errorHandler));
    vaccinationStatus.setTetanus(readNumberOfVaccinations(col, TETANUS, errorHandler));
    vaccinationStatus.setDiphtheria(readNumberOfVaccinations(col, DIPHTERIA, errorHandler));
    vaccinationStatus.setPertussis(readNumberOfVaccinations(col, PERTUSSIS, errorHandler));
    vaccinationStatus.setPolio(readNumberOfVaccinations(col, POLIO, errorHandler));
    vaccinationStatus.setHib(readNumberOfVaccinations(col, HIB, errorHandler));
    vaccinationStatus.setHepatitisB(readNumberOfVaccinations(col, HEPATITIS_B, errorHandler));
    vaccinationStatus.setMmr(readNumberOfVaccinations(col, MMR, errorHandler));
    vaccinationStatus.setVaricella(readNumberOfVaccinations(col, VARICELLA, errorHandler));
    vaccinationStatus.setMeningococcusC(
        readNumberOfVaccinations(col, MENINGOCOCCUS_C, errorHandler));
    vaccinationStatus.setPneumococcus(readNumberOfVaccinations(col, PNEUMOCOCCUS, errorHandler));
    vaccinationStatus.setHepatitisA(readNumberOfVaccinations(col, HEPATITIS_A, errorHandler));
    vaccinationStatus.setTbe(readNumberOfVaccinations(col, TBE, errorHandler));
    vaccinationStatus.setRota(readNumberOfVaccinations(col, ROTA, errorHandler));
    vaccinationStatus.setMeningococcusB(
        readNumberOfVaccinations(col, MENINGOCOCCUS_B, errorHandler));
    vaccinationStatus.setPerkombiHbv(readBooleanWithUnknown(col, PERKOMBI_HBV, errorHandler));
    return vaccinationStatus;
  }

  private EyeExaminationResult readEyeExamination(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    EyeExaminationResult eyeExaminationResult = new EyeExaminationResult();
    eyeExaminationResult.setEyeExamination(
        readExaminationResult(col, EYE_EXAMINATION, errorHandler));
    eyeExaminationResult.setLangExamination(
        readExaminationResult(col, LANG_EXAMINATION, errorHandler));
    eyeExaminationResult.setIshiharaExamination(
        readExaminationResult(col, ISHIHARA_EXAMINATION, errorHandler));
    return eyeExaminationResult;
  }

  private HearingTestResult readHearingTest(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    HearingTestResult hearingTestResult = new HearingTestResult();
    hearingTestResult.setExaminationResult(readExaminationResult(col, HEARING_TEST, errorHandler));
    return hearingTestResult;
  }

  private SopessExaminationResult readSopessExamination(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    SopessExaminationResult sopessExaminationResult = new SopessExaminationResult();

    Integer articulationSum = readIntegerInRange(col, ARTICULATION, errorHandler, 0, 10, 99);
    if (articulationSum != null) {
      setAllArticulationValues(articulationSum, sopessExaminationResult);
    }

    sopessExaminationResult.setJumpCount(
        readIntegerInRange(col, JUMP_COUNT, errorHandler, 0, 30, 99));
    sopessExaminationResult.setVisuoMotor(
        readIntegerInRange(col, VISUO_MOTOR, errorHandler, 0, 12, 99));
    sopessExaminationResult.setGrossMotorSkills(
        readSopessExaminationResultValue(
            col,
            GROSS_MOTOR,
            errorHandler,
            SopessExaminationResult::setDoctorLetterGrossMotorSkills,
            sopessExaminationResult));
    sopessExaminationResult.setFineMotorSkills(
        readSopessExaminationResultValue(
            col,
            FINE_MOTOR,
            errorHandler,
            SopessExaminationResult::setDoctorLetterFineMotorSkills,
            sopessExaminationResult));
    sopessExaminationResult.setPrimaryLanguage(readPrimaryLanguageValue(col, errorHandler));
    sopessExaminationResult.setFamilyLanguage(readFamilyLanguageValue(col, errorHandler));
    sopessExaminationResult.setGermanKnowledgePrimaryCarer(
        readLanguageKnowledgeValue(col, errorHandler));
    sopessExaminationResult.setGermanKnowledgeChild(readGermanKnowledgeValue(col, errorHandler));
    sopessExaminationResult.setInGermanySince(readInGermanySince(col, errorHandler));
    sopessExaminationResult.setPseudowordPoints(
        readIntegerInRange(col, PSEUDOWORDS, errorHandler, 0, 6, 9));
    sopessExaminationResult.setPrepositionPoints(
        readIntegerInRange(col, PREPOSITIONS, errorHandler, 0, 8, 9));
    sopessExaminationResult.setPluralPoints(
        readIntegerInRange(col, PLURALS, errorHandler, 0, 7, 9));
    sopessExaminationResult.setSpeechResult(
        readSopessExaminationResultValue(
            col,
            SPEECH_RESULT,
            errorHandler,
            SopessExaminationResult::setDoctorLetterSpeech,
            sopessExaminationResult));
    sopessExaminationResult.setVisualPerceptionPoints(
        readIntegerInRange(col, VISUAL_PERCEPTION_POINTS, errorHandler, 0, 15, 99));
    sopessExaminationResult.setAuditiveProcessingResult(
        readSopessExaminationResultValue(
            col,
            AUDITIVE_PROCESSING,
            errorHandler,
            SopessExaminationResult::setDoctorLetterAuditiveProcessing,
            sopessExaminationResult));
    sopessExaminationResult.setVisualPerceptionResult(
        readSopessExaminationResultValue(
            col,
            VISUAL_PERCEPTION_RESULT,
            errorHandler,
            SopessExaminationResult::setDoctorLetterVisualPerception,
            sopessExaminationResult));
    sopessExaminationResult.setCountingPoints(
        readIntegerInRange(col, COUNTING, errorHandler, 0, 20, 99));
    sopessExaminationResult.setQuantityKnowledgePoints(
        readIntegerInRange(col, QUANTITY_KNOWLEDGE, errorHandler, 0, 16, 99));
    sopessExaminationResult.setSelectiveAttentionPoints(
        readIntegerInRange(col, SELECTIVE_ATTENTION, errorHandler, 0, 29, 99));
    sopessExaminationResult.setKnowledgeThinkingResult(
        readSopessExaminationResultValue(
            col,
            KNOWLEDGE_THINKING,
            errorHandler,
            SopessExaminationResult::setDoctorLetterKnowledgeThinking,
            sopessExaminationResult));
    sopessExaminationResult.setPsychologicalBehaviorResult(
        readSopessExaminationResultValue(
            col,
            PSYCHOLOGICAL_BEHAVIOUR,
            errorHandler,
            SopessExaminationResult::setDoctorLetterPsychologicalBehavior,
            sopessExaminationResult));
    return sopessExaminationResult;
  }

  private void setAllArticulationValues(
      Integer articulationSum, SopessExaminationResult sopessExaminationResult) {
    List<BiConsumer<SopessExaminationResult, ArticulationValue>> articulationSetters =
        List.of(
            SopessExaminationResult::setLettersSAndZPoints,
            SopessExaminationResult::setFormationSchPoints,
            SopessExaminationResult::setLettersTAndDPoints,
            SopessExaminationResult::setFormationChPoints,
            SopessExaminationResult::setLettersGAndKPoints,
            SopessExaminationResult::setLettersLAndNPoints,
            SopessExaminationResult::setLetterRPoints,
            SopessExaminationResult::setLetterFAndFormationPfPoints,
            SopessExaminationResult::setLetterBPoints,
            SopessExaminationResult::setFormationsTrDrKrGrPoints);

    if (articulationSum == 0) {
      for (int i = 0; i < articulationSetters.size(); i++) {
        articulationSetters.get(i).accept(sopessExaminationResult, ArticulationValue.INCONSPICUOUS);
      }
    } else {
      for (int i = 0; i < articulationSetters.size(); i++) {
        if (i < articulationSum) {
          articulationSetters.get(i).accept(sopessExaminationResult, ArticulationValue.CONSPICUOUS);
        } else {
          articulationSetters.get(i).accept(sopessExaminationResult, ArticulationValue.UNKNOWN);
        }
      }
    }
  }

  private DevelopmentScreening readDevelopmentScreening(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    DevelopmentScreening developmentScreening = new DevelopmentScreening();
    developmentScreening.setSystole(readIntegerInRange(col, SYSTOLE, errorHandler, 50, 250, 999));
    developmentScreening.setDiastole(readIntegerInRange(col, DIASTOLE, errorHandler, 50, 250, 999));
    developmentScreening.setHeight(
        calculateHeight(readDoubleInRange(col, HEIGHT, errorHandler, 0.7, 1.6, 9.9)));
    developmentScreening.setWeight(readDoubleInRange(col, WEIGHT, errorHandler, 8.0, 80.0, 99.9));
    developmentScreening.setNutritionalCondition(
        readExaminationWithDiagnosis(col, NUTRITIONAL_CONDITION, errorHandler));
    developmentScreening.setSkin(readExaminationWithDiagnosis(col, SKIN, errorHandler));
    developmentScreening.setMusculatureSkeleton(
        readExaminationWithDiagnosis(col, MUSCULATOR_SKELETON, errorHandler));
    developmentScreening.setEarNoseThroat(
        readExaminationWithDiagnosis(col, EAR_NOSE_THROAT, errorHandler));
    developmentScreening.setRespiratoryCardiovascular(
        readExaminationWithDiagnosis(col, RESPIRATORY_CARDIOVASCULAR, errorHandler));
    developmentScreening.setAbdomen(readExaminationWithDiagnosis(col, ABDOMEN, errorHandler));
    developmentScreening.setNeurology(readExaminationWithDiagnosis(col, NEUROLOGY, errorHandler));
    developmentScreening.setMetabolism(readExaminationWithDiagnosis(col, METABOLISM, errorHandler));
    developmentScreening.setChronicDisease(readChronicDisease(col, errorHandler));
    developmentScreening.setDisability(readDisability(col, errorHandler));
    developmentScreening.setDisabilityType(readDisabilityType(col, errorHandler));
    developmentScreening.setVaccinationAdvice(cellAsBoolean(col, VACCINATION_ADVICE, errorHandler));
    developmentScreening.setReIntroduction(cellAsBoolean(col, RE_INTRODUCTION, errorHandler));
    developmentScreening.setSchoolCounselling(cellAsBoolean(col, SCHOOL_COUNSELING, errorHandler));
    developmentScreening.setInfoLetter(cellAsBoolean(col, INFO_LETTER, errorHandler));
    developmentScreening.setMotorPromotion(cellAsBoolean(col, MOTOR_PROMOTION, errorHandler));
    developmentScreening.setLanguageAdvice(cellAsBoolean(col, LANGUAGE_ADVICE, errorHandler));
    developmentScreening.setNutritionalAdvice(cellAsBoolean(col, NUTRITIONAL_ADVICE, errorHandler));
    developmentScreening.setEducationalAdvice(cellAsBoolean(col, EDUCATIONAL_ADVICE, errorHandler));
    developmentScreening.setSocialService(cellAsBoolean(col, SOCIAL_SERVICE, errorHandler));
    developmentScreening.setOtherSupport(cellAsBoolean(col, OTHER_SUPPORT, errorHandler));
    developmentScreening.setExtraEffort(cellAsBoolean(col, EXTRA_EFFORT, errorHandler));
    developmentScreening.setSchoolRecommendation(readSchoolRecommendation(col, errorHandler));
    return developmentScreening;
  }

  private Integer calculateHeight(Double heightInMetre) {
    if (heightInMetre == null) {
      return null;
    }
    if (heightInMetre > 9) {
      return 999;
    }
    return BigDecimal.valueOf(heightInMetre)
        .multiply(BigDecimal.valueOf(100))
        .setScale(0, RoundingMode.HALF_UP)
        .intValue();
  }

  private ImportChildData readChildData(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, MAX_FIRST_NAME_LENGTH, errorHandler),
        cellAsString(col, LAST_NAME, MAX_LAST_NAME_LENGTH, errorHandler),
        cellAsDateOfBirth(col, DATE_OF_BIRTH, false, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        readAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            false),
        null,
        null);
  }

  private ProcedureType readProcedureType(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(PROCEDURE_TYPE);
    String string = cellAsString(cell, errorHandler);
    if (string == null) {
      return null;
    }
    return switch (string.toUpperCase()) {
      case "REGEL" -> ProcedureType.REGULAR_EXAMINATION;
      case "KANN" -> ProcedureType.CAN_CHILD;
      case "EINGANGSSTUFE" -> ProcedureType.ENTRY_LEVEL;
      default -> {
        errorHandler.handleError(cell, "Ungültiger Wert");
        yield null;
      }
    };
  }

  private LocalDate readInGermanySince(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(IN_GERMANY_SINCE);
    String value = cellAsString(col, IN_GERMANY_SINCE, errorHandler);
    if (value == null || !value.matches(DATE_FORMAT)) {
      errorHandler.handleError(
          cell, "Ungültiger Wert (Erwartet: MM.YYYY. Tatsächlich: %s)".formatted(value));
      return null;
    }
    return YearMonth.parse(value, DateTimeFormatter.ofPattern("MM.yyyy")).atDay(1);
  }

  private boolean cellAsBooleanWithFallbackFalse(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    Boolean value = cellAsBooleanOrNull(col, column, errorHandler);
    if (value == null) {
      return false;
    }
    return value;
  }

  private VaccinationSchemeValue readVaccinationScheme(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(VACCINATION_SCHEME);
    Integer value = cellAsInt(col, VACCINATION_SCHEME, errorHandler);
    return switch (value) {
      case 2 -> VaccinationSchemeValue.SCHEME_2_PLUS_1;
      case 3 -> VaccinationSchemeValue.SCHEME_3_PLUS_1;
      case 9 -> VaccinationSchemeValue.UNKNOWN;
      case null, default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: 2, 3 oder 9. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private Integer readNumberOfVaccinations(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    return readIntegerInRange(col, column, errorHandler, 0, 9);
  }

  private Integer readIntegerInRange(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler,
      int min,
      int max,
      int unknownValue) {
    Cell cell = col.get(column);
    Integer value = cellAsInt(col, column, errorHandler);
    Range<Integer> validRange = Range.closed(min, max);
    if (value == null || (!validRange.contains(value) && value != unknownValue)) {
      errorHandler.handleError(
          cell,
          "Ungültiger Wert (Erwartet: Wert zwischen %d und %d sowie %d. Tatsächlich: %s)"
              .formatted(min, max, unknownValue, value));
    }
    return value;
  }

  private Integer readIntegerInRange(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler,
      int min,
      int max) {
    Cell cell = col.get(column);
    Integer value = cellAsInt(col, column, errorHandler);
    Range<Integer> validRange = Range.closed(min, max);
    if (value == null || !validRange.contains(value)) {
      errorHandler.handleError(
          cell,
          "Ungültiger Wert (Erwartet: Wert zwischen %s und %s. Tatsächlich: %s)"
              .formatted(min, max, value));
    }
    return value;
  }

  private Double readDoubleInRange(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler,
      double min,
      double max,
      double unknownValue) {
    Cell cell = col.get(column);
    Double value = cellAsDouble(col, column, errorHandler);
    Range<Double> validRange = Range.closed(min, max);
    if (value == null || (!validRange.contains(value) && value != unknownValue)) {
      errorHandler.handleError(
          cell,
          "Ungültiger Wert (Erwartet: Wert zwischen %f und %f sowie %f. Tatsächlich: %s)"
              .formatted(min, max, unknownValue, value));
    }
    return value;
  }

  private ExaminationResult readExaminationResult(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String value = cellAsString(col, column, errorHandler);
    return switch (value) {
      case "I", "i", "B", "b", "U", "u" -> {
        ExaminationResult examinationResult = new ExaminationResult();
        examinationResult.setValue(mapToExaminationResultValue(value));
        yield examinationResult;
      }
      case "A", "a" -> {
        ExaminationResult examinationResult = new ExaminationResult();
        examinationResult.setValue(mapToExaminationResultValue(value));
        examinationResult.setDoctorLetter(DoctorLetterValue.NO_REPLY);
        yield examinationResult;
      }
      case null, default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: I, B, A oder U. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private ExaminationWithDiagnosis readExaminationWithDiagnosis(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    String value = cellAsString(col, column, errorHandler);
    return switch (value) {
      case "I", "i", "B", "b", "U", "u" -> {
        ExaminationResult examinationResult = new ExaminationResult();
        examinationResult.setValue(mapToExaminationResultValue(value));
        yield getExaminationWithDiagnosis(examinationResult);
      }
      case "A", "a" -> {
        ExaminationResult examinationResult = new ExaminationResult();
        examinationResult.setValue(mapToExaminationResultValue(value));
        examinationResult.setDoctorLetter(DoctorLetterValue.NO_REPLY);
        yield getExaminationWithDiagnosis(examinationResult);
      }
      case null, default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: I, B, A oder U. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private static ExaminationWithDiagnosis getExaminationWithDiagnosis(
      ExaminationResult examinationResult) {
    ExaminationWithDiagnosis examinationWithDiagnosis = new ExaminationWithDiagnosis();
    examinationWithDiagnosis.setResult(examinationResult);
    return examinationWithDiagnosis;
  }

  private ExaminationResultValue mapToExaminationResultValue(String stringValue) {
    return switch (stringValue.toUpperCase()) {
      case "I" -> ExaminationResultValue.OK;
      case "B" -> ExaminationResultValue.KNOWN;
      case "A" -> ExaminationResultValue.DOCTOR_LETTER;
      case "U" -> ExaminationResultValue.UNKNOWN;
      default -> throw new IllegalArgumentException("Only I, B, A and U are allowed");
    };
  }

  private SopessExaminationResultValue readSopessExaminationResultValue(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler,
      BiConsumer<SopessExaminationResult, DoctorLetterValue> doctorLetterValueSetter,
      SopessExaminationResult sopessExaminationResult) {
    Cell cell = col.get(column);
    String value = cellAsString(col, column, errorHandler);
    return switch (value) {
      case "I", "i" -> SopessExaminationResultValue.OK;
      case "B", "b" -> SopessExaminationResultValue.KNOWN;
      case "G", "g" -> SopessExaminationResultValue.BORDERLINE;
      case "U", "u" -> SopessExaminationResultValue.UNKNOWN;
      case "A", "a" -> {
        doctorLetterValueSetter.accept(sopessExaminationResult, DoctorLetterValue.NO_REPLY);
        yield SopessExaminationResultValue.DOCTOR_LETTER;
      }
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: I, B, A, G oder U. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private PrimaryLanguageValue readPrimaryLanguageValue(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(PRIMARY_LANGUAGE);
    Integer value = cellAsInt(col, PRIMARY_LANGUAGE, errorHandler);
    return switch (value) {
      case 1 -> PrimaryLanguageValue.GERMAN;
      case 2 -> PrimaryLanguageValue.OTHER;
      case 3 -> PrimaryLanguageValue.OTHER_AND_GERMAN;
      case 4 -> PrimaryLanguageValue.MULTIPLE_OTHER;
      case 9 -> PrimaryLanguageValue.UNKNOWN;
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Wert zwischen 1 und 4 sowie 9. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private LanguageKnowledgeValue readLanguageKnowledgeValue(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(GERMAN_PRIMARY_CARER);
    Integer value = cellAsInt(col, GERMAN_PRIMARY_CARER, errorHandler);
    return switch (value) {
      case 1 -> LanguageKnowledgeValue.RUDIMENTARY;
      case 2 -> LanguageKnowledgeValue.FAULTY;
      case 3 -> LanguageKnowledgeValue.FAULTLESS;
      case 9 -> LanguageKnowledgeValue.UNKNOWN;
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Wert zwischen 1 und 3 sowie 9. Tatsächlich: %s)"
                .formatted(value));
        yield null;
      }
    };
  }

  private GermanKnowledgeValue readGermanKnowledgeValue(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(GERMAN_CHILD);
    Integer value = cellAsInt(col, GERMAN_CHILD, errorHandler);
    return switch (value) {
      case 1 -> GermanKnowledgeValue.NO_GERMAN;
      case 2 -> GermanKnowledgeValue.BAD;
      case 3 -> GermanKnowledgeValue.FLUID_WITH_MAJOR_ERRORS;
      case 4 -> GermanKnowledgeValue.FLUID_WITH_MINOR_ERRORS;
      case 5 -> GermanKnowledgeValue.FAULTLESS;
      case 9 -> GermanKnowledgeValue.UNKNOWN;
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Wert zwischen 1 und 5 sowie 9. Tatsächlich: %s)"
                .formatted(value));
        yield null;
      }
    };
  }

  private FamilyLanguageValue readFamilyLanguageValue(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(FAMILY_LANGUAGE);
    String value = cellAsString(col, FAMILY_LANGUAGE, errorHandler);
    return switch (value) {
      case "\"00\"" -> FamilyLanguageValue.GERMAN;
      case "\"01\"" -> FamilyLanguageValue.TURKISH;
      case "\"02\"" -> FamilyLanguageValue.KURDISH;
      case "\"03\"" -> FamilyLanguageValue.RUSSIAN;
      case "\"04\"" -> FamilyLanguageValue.POLISH;
      case "\"05\"" -> FamilyLanguageValue.ARABIC;
      case "\"06\"" -> FamilyLanguageValue.FARSI_DARI;
      case "\"07\"" -> FamilyLanguageValue.SERBO_CROATIAN;
      case "\"08\"" -> FamilyLanguageValue.ROMAN;
      case "\"09\"" -> FamilyLanguageValue.BULGARIAN;
      case "\"10\"" -> FamilyLanguageValue.PASHTU;
      case "\"11\"" -> FamilyLanguageValue.TIGRINIA;
      case "\"12\"" -> FamilyLanguageValue.BERBERIAN;
      case "\"13\"" -> FamilyLanguageValue.AMHARIAN;
      case "\"14\"" -> FamilyLanguageValue.ARAMEAN;
      case "\"15\"" -> FamilyLanguageValue.ITALIAN;
      case "\"16\"" -> FamilyLanguageValue.SPANISH;
      case "\"17\"" -> FamilyLanguageValue.GREEK;
      case "\"18\"" -> FamilyLanguageValue.PORTUGUESE;
      case "\"19\"" -> FamilyLanguageValue.ENGLISH;
      case "\"20\"" -> FamilyLanguageValue.FRENCH;
      case "\"21\"" -> FamilyLanguageValue.URDU;
      case "\"22\"" -> FamilyLanguageValue.OTHER_EUROPEAN_LANGUAGES;
      case "\"23\"" -> FamilyLanguageValue.OTHER_ASIAN_LANGUAGES;
      case "\"24\"" -> FamilyLanguageValue.OTHER_AFRICAN_LANGUAGES;
      case "\"25\"" -> FamilyLanguageValue.OTHER_LANGUAGES;
      case "\"99\"" -> FamilyLanguageValue.UNKNOWN;
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: \"00\"-\"25\" sowie \"99\". Tatsächlich: %s)"
                .formatted(value));
        yield null;
      }
    };
  }

  private HandicapWithDiagnosis readChronicDisease(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return readHandicapWithDiagnosis(
        col, CHRONIC_DISEASE, CHRONIC_DISEASE_ICD10_COLUMNS, errorHandler);
  }

  private HandicapWithDiagnosis readDisability(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return readHandicapWithDiagnosis(col, DISABILITY, DISABILITY_ICD10_COLUMNS, errorHandler);
  }

  private HandicapWithDiagnosis readHandicapWithDiagnosis(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn hasDiagnosisColumn,
      List<PastProcedureListColumn> icd10Columns,
      ErrorHandler errorHandler) {
    List<String> icd10CodesIncludingNulls =
        icd10Columns.stream()
            .map(icd10Column -> readIcd10Value(col, icd10Column, errorHandler))
            .toList();

    List<String> icd10Codes = icd10CodesIncludingNulls.stream().filter(Objects::nonNull).toList();

    Cell hasDiagnosisCell = col.get(hasDiagnosisColumn);
    boolean hasDiagnosis = cellAsBoolean(col, hasDiagnosisColumn, errorHandler);
    if (hasDiagnosis && icd10Codes.isEmpty()) {
      errorHandler.handleError(
          hasDiagnosisCell, "Ungültiger Wert (Diagnosen erwartet, wenn Ja angegeben)");
    } else if (!hasDiagnosis && !icd10Codes.isEmpty()) {
      errorHandler.handleError(
          hasDiagnosisCell, "Ungültiger Wert (Ja erwartet, da Diagnosen angegeben)");
    }

    HandicapWithDiagnosis handicapWithDiagnosis = new HandicapWithDiagnosis();
    handicapWithDiagnosis.setResult(hasDiagnosis);
    handicapWithDiagnosis.setIcd10Codes(icd10Codes);
    handicapWithDiagnosis.setIcd10CodesIncludingNulls(icd10CodesIncludingNulls);
    return handicapWithDiagnosis;
  }

  private String readIcd10Value(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn icd10Column,
      ErrorHandler errorHandler) {
    return cellAsString(col, icd10Column, true, false, errorHandler);
  }

  private DisabilityType readDisabilityType(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(DISABILITY_TYPE);
    String value = cellAsString(col, DISABILITY_TYPE, true, false, errorHandler);
    boolean disabilityValue = cellAsBooleanWithFallbackFalse(col, DISABILITY, errorHandler);

    if (!disabilityValue) {
      if (value != null) {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Kein Wert erwartet, wenn kein BEHI vorliegt)");
      }
      return null;
    } else if (value == null || value.isBlank()) {
      errorHandler.handleError(
          cell, "Ungültiger Wert (K, G, S oder M erwartet, wenn BEHI vorliegt)");
      return null;
    }

    return switch (value.toUpperCase()) {
      case "K" -> DisabilityType.PHYSICAL;
      case "G" -> DisabilityType.MENTAL;
      case "S" -> DisabilityType.EMOTIONAL;
      case "M" -> DisabilityType.MULTIPLE;
      default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: K, G, S oder M. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private SchoolRecommendation readSchoolRecommendation(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(SCHOOL_RECOMMENDATION);
    String value = cellAsString(col, SCHOOL_RECOMMENDATION, errorHandler);

    if (value == null) {
      errorHandler.handleError(
          cell, "Ungültiger Wert (Erwartet: Nein, ZURK, ZUEK, BEKK oder BFZ. Tatsächlich: null)");
      return null;
    }

    return switch (value.toUpperCase()) {
      case "NEIN" -> SchoolRecommendation.NO;
      case "ZURK" -> SchoolRecommendation.BACK_REGULAR;
      case "ZUEK" -> SchoolRecommendation.BACK_ENTRY_LEVEL;
      case "BEKK" -> SchoolRecommendation.CONCERNS_EARLY_ENROLMENT;
      case "BFZ" -> SchoolRecommendation.ADVICE_CENTER;
      default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Nein, ZURK, ZUEK, BEKK oder BFZ. Tatsächlich: %s)"
                .formatted(value));
        yield null;
      }
    };
  }
}
