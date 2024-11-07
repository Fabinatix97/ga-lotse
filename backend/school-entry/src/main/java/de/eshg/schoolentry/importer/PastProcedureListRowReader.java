/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import static de.eshg.schoolentry.importer.PastProcedureListColumn.*;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.ColumnAccessor;
import de.eshg.lib.xlsximport.ErrorHandler;
import de.eshg.lib.xlsximport.RowReader;
import de.eshg.schoolentry.business.model.*;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository;
import de.eshg.schoolentry.domain.repository.Icd10GroupRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.BiConsumer;
import java.util.stream.Stream;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.data.domain.Range;

public class PastProcedureListRowReader
    extends RowReader<PastProcedureListRowValues, PastProcedureListColumn> {

  private final Icd10CodeRepository icd10CodeRepository;
  private final Icd10GroupRepository icd10GroupRepository;
  public static final String DATE_FORMAT = "^\\d{2}\\.\\d{4}$";

  public PastProcedureListRowReader(
      Sheet sheet,
      List<PastProcedureListColumn> actualColumns,
      Icd10CodeRepository icd10CodeRepository,
      Icd10GroupRepository icd10GroupRepository) {
    super(sheet, actualColumns);
    this.icd10CodeRepository = icd10CodeRepository;
    this.icd10GroupRepository = icd10GroupRepository;
  }

  @Override
  protected PastProcedureListRowValues read(ColumnAccessor<PastProcedureListColumn> col) {
    PastProcedureListRowValues result = new PastProcedureListRowValues();
    ErrorHandler errorHandler = createErrorHandler(result);

    result.setChild(readChildData(col, errorHandler));
    result.setProcedureType(readProcedureType(col, errorHandler));
    result.setExaminationDate(cellAsDate(col, EXAMINATION_DATE, errorHandler));
    result.setStatus(readStatus(col, STATUS, errorHandler));
    result.setProcedureId(readProcedureId(col, PROCEDURE_ID, errorHandler));
    result.setAnamnesisData(readAnamnesisData(col, errorHandler));
    result.setVaccinationStatusData(readVaccinationStatusData(col, errorHandler));
    result.setEyeExaminationResult(readEyeExaminationData(col, errorHandler));
    result.setHearingTestData(readHearingTestData(col, errorHandler));
    result.setSopessExaminationData(readSopessExaminationData(col, errorHandler));
    result.setDevelopmentScreeningData(readDevelopmentScreeningData(col, errorHandler));
    return result;
  }

  private ImportAnamnesisData readAnamnesisData(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return new ImportAnamnesisData(
        readIntegerInRange(col, SIBLINGS, errorHandler, 0, 15, 99),
        cellAsInt(col, NATIONALITY_CHILD, errorHandler),
        cellAsInt(col, NATIONALITY_P1, errorHandler),
        cellAsInt(col, COUNTRY_OF_BIRTH_P1, errorHandler),
        cellAsInt(col, NATIONALITY_P2, errorHandler),
        cellAsInt(col, COUNTRY_OF_BIRTH_P2, errorHandler),
        cellAsBoolean(col, MIGRATION_BACKGROUND, errorHandler),
        readIntegerInRange(col, DAYCARE, errorHandler, 0, 3, 9),
        cellAsBooleanWithFallbackFalse(col, PRELIMINARY_COURSE, errorHandler),
        readIntegerInRange(col, BIRTH_WEIGHT, errorHandler, 300, 6000, 9999),
        cellAsBooleanWithFallbackFalse(col, INTEGRATION_PLACE, errorHandler),
        cellAsBooleanWithFallbackFalse(col, EARLY_SUPPORT, errorHandler),
        cellAsBooleanWithFallbackFalse(col, ERGO_THERAPY, errorHandler),
        cellAsBooleanWithFallbackFalse(col, SPEECH_THERAPY, errorHandler),
        cellAsBooleanWithFallbackFalse(col, PHYSIO_THERAPY, errorHandler),
        cellAsBooleanWithFallbackFalse(col, CHILD_LANGUAGE_SCREENING, errorHandler),
        cellAsBooleanOrNull(col, U2, errorHandler),
        cellAsBooleanOrNull(col, U3, errorHandler),
        cellAsBooleanOrNull(col, U4, errorHandler),
        cellAsBooleanOrNull(col, U5, errorHandler),
        cellAsBooleanOrNull(col, U6, errorHandler),
        cellAsBooleanOrNull(col, U7, errorHandler),
        cellAsBooleanOrNull(col, U7A, errorHandler),
        cellAsBooleanOrNull(col, U8, errorHandler),
        cellAsBooleanOrNull(col, U9, errorHandler),
        readInGermanySince(col, errorHandler));
  }

  private ImportVaccinationStatusData readVaccinationStatusData(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return new ImportVaccinationStatusData(
        readVaccinationScheme(col, errorHandler),
        readNumberOfVaccinations(col, TETANUS, errorHandler),
        readNumberOfVaccinations(col, DIPHTERIA, errorHandler),
        readNumberOfVaccinations(col, PERTUSSIS, errorHandler),
        readNumberOfVaccinations(col, POLIO, errorHandler),
        readNumberOfVaccinations(col, HIB, errorHandler),
        readNumberOfVaccinations(col, HEPATITIS_B, errorHandler),
        readNumberOfVaccinations(col, MMR, errorHandler),
        readNumberOfVaccinations(col, VARICELLA, errorHandler),
        readNumberOfVaccinations(col, MENINGOCOCCUS_C, errorHandler),
        readNumberOfVaccinations(col, PNEUMOCOCCUS, errorHandler),
        readNumberOfVaccinations(col, HEPATITIS_A, errorHandler),
        readNumberOfVaccinations(col, TBE, errorHandler),
        readNumberOfVaccinations(col, ROTA, errorHandler),
        readNumberOfVaccinations(col, MENINGOCOCCUS_B, errorHandler),
        cellAsBooleanOrNull(col, PERKOMBI_HBV, errorHandler));
  }

  private EyeExaminationResult readEyeExaminationData(
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

  private HearingTestResult readHearingTestData(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    HearingTestResult hearingTestResult = new HearingTestResult();
    hearingTestResult.setExaminationResult(readExaminationResult(col, HEARING_TEST, errorHandler));
    return hearingTestResult;
  }

  private SopessExaminationResult readSopessExaminationData(
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

  private DevelopmentScreening readDevelopmentScreeningData(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    DevelopmentScreening developmentScreening = new DevelopmentScreening();
    developmentScreening.setSystole(readIntegerInRange(col, SYSTOLE, errorHandler, 50, 250, 999));
    developmentScreening.setDiastole(readIntegerInRange(col, DIASTOLE, errorHandler, 50, 250, 999));
    developmentScreening.setHeight(readDoubleInRange(col, HEIGHT, errorHandler, 0.7, 1.6, 9.9));
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

  private ImportChildData readChildData(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return new ImportChildData(
        cellAsString(col, FIRST_NAME, errorHandler),
        cellAsString(col, LAST_NAME, errorHandler),
        cellAsDate(col, DATE_OF_BIRTH, errorHandler),
        cellAsGender(col, GENDER, errorHandler),
        readAddressData(
            col,
            new AddressColumns<>(STREET, HOUSE_NUMBER, POSTAL_CODE, CITY, ADDRESS_ADDITION),
            errorHandler,
            false),
        null);
  }

  private ProcedureType readProcedureType(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(PROCEDURE_TYPE);
    String string = cellAsString(cell, errorHandler);

    return switch (string) {
      case null -> null;
      case "Regel" -> ProcedureType.REGULAR_EXAMINATION;
      case "Kann" -> ProcedureType.CAN_CHILD;
      case "Eingangsstufe" -> ProcedureType.ENTRY_LEVEL;
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

  private Integer readVaccinationScheme(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(VACCINATION_SCHEME);
    Integer value = cellAsInt(col, VACCINATION_SCHEME, errorHandler);
    return switch (value) {
      case 2, 3, 9 -> value;
      case null, default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: 2, 3 oder 9. Tatsächlich: %s)".formatted(value));
        yield value;
      }
    };
  }

  private Integer readNumberOfVaccinations(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    Integer value = cellAsInt(col, column, errorHandler);
    Range<Integer> validRange = Range.closed(0, 9);
    if (value == null || !validRange.contains(value)) {
      errorHandler.handleError(
          cell,
          "Ungültiger Wert (Erwartet: Wert zwischen 0 und 9. Tatsächlich: %s)".formatted(value));
    }
    return value;
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
      case "I", "B", "U" -> {
        ExaminationResult examinationResult = new ExaminationResult();
        examinationResult.setValue(mapToExaminationResultValue(value));
        yield examinationResult;
      }
      case "A" -> {
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
      case "I", "B", "U" -> {
        ExaminationResult examinationResult = new ExaminationResult();
        examinationResult.setValue(mapToExaminationResultValue(value));
        yield getExaminationWithDiagnosis(examinationResult);
      }
      case "A" -> {
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
    return switch (stringValue) {
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
      case "I" -> SopessExaminationResultValue.OK;
      case "B" -> SopessExaminationResultValue.KNOWN;
      case "G" -> SopessExaminationResultValue.BORDERLINE;
      case "U" -> SopessExaminationResultValue.UNKNOWN;
      case "A" -> {
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
    String value = cellAsInt(col, PRIMARY_LANGUAGE, errorHandler).toString();
    return switch (value) {
      case "1" -> PrimaryLanguageValue.GERMAN;
      case "2" -> PrimaryLanguageValue.OTHER;
      case "9" -> PrimaryLanguageValue.UNKNOWN;
      default -> {
        errorHandler.handleError(
            cell, "Ungültiger Wert (Erwartet: 1, 2 oder 9. Tatsächlich: %s)".formatted(value));
        yield null;
      }
    };
  }

  private LanguageKnowledgeValue readLanguageKnowledgeValue(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    Cell cell = col.get(GERMAN_PRIMARY_CARER);
    String value = cellAsInt(col, GERMAN_PRIMARY_CARER, errorHandler).toString();
    return switch (value) {
      case "1" -> LanguageKnowledgeValue.RUDIMENTARY;
      case "2" -> LanguageKnowledgeValue.FAULTY;
      case "3" -> LanguageKnowledgeValue.FAULTLESS;
      case "9" -> LanguageKnowledgeValue.UNKNOWN;
      default -> {
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
    String value = cellAsInt(col, GERMAN_CHILD, errorHandler).toString();
    return switch (value) {
      case "1" -> GermanKnowledgeValue.NO_GERMAN;
      case "2" -> GermanKnowledgeValue.BAD;
      case "3" -> GermanKnowledgeValue.FLUID_WITH_MAJOR_ERRORS;
      case "4" -> GermanKnowledgeValue.FLUID_WITH_MINOR_ERRORS;
      case "5" -> GermanKnowledgeValue.FAULTLESS;
      case "9" -> GermanKnowledgeValue.UNKNOWN;
      default -> {
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
        col,
        CHRONIC_DISEASE,
        CHRONIC_DISEASE_ICD10_1,
        CHRONIC_DISEASE_ICD10_2,
        CHRONIC_DISEASE_ICD10_3,
        errorHandler);
  }

  private HandicapWithDiagnosis readDisability(
      ColumnAccessor<PastProcedureListColumn> col, ErrorHandler errorHandler) {
    return readHandicapWithDiagnosis(
        col, DISABILITY, DISABILITY_ICD10_1, DISABILITY_ICD10_2, DISABILITY_ICD10_3, errorHandler);
  }

  private HandicapWithDiagnosis readHandicapWithDiagnosis(
      ColumnAccessor<PastProcedureListColumn> col,
      PastProcedureListColumn column,
      PastProcedureListColumn diagnosis1,
      PastProcedureListColumn diagnosis2,
      PastProcedureListColumn diagnosis3,
      ErrorHandler errorHandler) {
    Cell cell = col.get(column);
    Cell cellDiagnosis1 = col.get(diagnosis1);
    Cell cellDiagnosis2 = col.get(diagnosis2);
    Cell cellDiagnosis3 = col.get(diagnosis3);
    boolean value = cellAsBoolean(col, column, errorHandler);
    String icd10Code1 = cellAsString(col, diagnosis1, true, false, errorHandler);
    String icd10Code2 = cellAsString(col, diagnosis2, true, false, errorHandler);
    String icd10Code3 = cellAsString(col, diagnosis3, true, false, errorHandler);
    List<String> icd10Codes =
        Stream.of(icd10Code1, icd10Code2, icd10Code3)
            .filter(Objects::nonNull)
            .sorted(String::compareTo)
            .toList();

    if (value && icd10Codes.isEmpty()) {
      errorHandler.handleError(cell, "Ungültiger Wert (Diagnosen erwartet, wenn Ja angegeben)");
      return null;
    }

    Map<Cell, String> icd10CodesByCells = new LinkedHashMap<>();
    icd10CodesByCells.put(cellDiagnosis1, icd10Code1);
    icd10CodesByCells.put(cellDiagnosis2, icd10Code2);
    icd10CodesByCells.put(cellDiagnosis3, icd10Code3);

    boolean errorInICD10 = false;

    for (Map.Entry<Cell, String> icd10CodeByCell : icd10CodesByCells.entrySet()) {
      String icd10Code = icd10CodeByCell.getValue();
      if (icd10Code != null
          && !icd10CodeRepository.existsByCodeWithoutDot(icd10Code)
          && !icd10GroupRepository.existsByGroupStartAndGroupEnd(icd10Code)) {
        errorHandler.handleError(
            icd10CodeByCell.getKey(),
            "Ungültiger Wert (ICD-10 Code %s existiert nicht)".formatted(icd10Code));
        errorInICD10 = true;
      }
    }

    if (!value && !icd10Codes.isEmpty()) {
      errorHandler.handleError(cell, "Ungültiger Wert (Ja erwartet, da Diagnosen angegeben)");
      return null;
    }

    HandicapWithDiagnosis handicapWithDiagnosis = new HandicapWithDiagnosis();
    handicapWithDiagnosis.setResult(value);
    if (!errorInICD10) {
      handicapWithDiagnosis.setIcd10Codes(icd10Codes);
    }
    return handicapWithDiagnosis;
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

    return switch (value) {
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
    return switch (value) {
      case "Nein" -> SchoolRecommendation.NO;
      case "ZURK" -> SchoolRecommendation.BACK_REGULAR;
      case "ZUEK" -> SchoolRecommendation.BACK_ENTRY_LEVEL;
      case "BEKK" -> SchoolRecommendation.CONCERNS_EARLY_ENROLMENT;
      case "BFZ" -> SchoolRecommendation.ADVICE_CENTER;
      case null, default -> {
        errorHandler.handleError(
            cell,
            "Ungültiger Wert (Erwartet: Nein, ZURK, ZUEK, BEKK oder BFZ. Tatsächlich: %s)"
                .formatted(value));
        yield null;
      }
    };
  }
}
