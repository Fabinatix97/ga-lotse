/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter;

import static de.eshg.schoolentry.domain.model.SchoolRecommendation.BACK_ENTRY_LEVEL;
import static de.eshg.schoolentry.domain.model.SchoolRecommendation.BACK_REGULAR;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.api.CreateSchoolInfoLetterRequest;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.config.SchoolEntryFeature;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.pdf.schoolinfoletter.model.*;
import de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterExaminationType.Type;
import de.eshg.schoolentry.statistics.StatisticsValueMappers;
import de.eshg.schoolentry.statistics.options.EvaluationResult;
import java.time.Clock;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SchoolInfoLetterExaminationMapper {

  private static final Logger log =
      LoggerFactory.getLogger(SchoolInfoLetterExaminationMapper.class);
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");
  private static final DateTimeFormatter YEAR_FORMATTER = DateTimeFormatter.ofPattern("yyyy");

  private final Clock clock;
  private final SchoolEntryFeatureToggle featureToggle;

  public SchoolInfoLetterExaminationMapper(Clock clock, SchoolEntryFeatureToggle featureToggle) {
    this.clock = clock;
    this.featureToggle = featureToggle;
  }

  SchoolInfoLetterExamination mapToData(
      SchoolEntryProcedure procedure,
      ProcedureDetailsData procedureDetails,
      CreateSchoolInfoLetterRequest request) {
    DevelopmentScreening developmentScreening = procedure.getDevelopmentScreeningResult();
    SopessExaminationResult sopess = procedure.getSopessExaminationResult();
    VaccinationStatus vaccinationStatus = procedure.getVaccinationStatus();
    EyeExaminationResult eyeExaminationResult = procedure.getEyeExaminationResult();
    return new SchoolInfoLetterExamination(
        new SchoolInfoLetterChild(
            concat(procedureDetails.child().firstName(), procedureDetails.child().lastName()),
            procedureDetails.child().dateOfBirth().format(DATE_FORMATTER)),
        YEAR_FORMATTER.format(getSchoolYear(procedureDetails)),
        DATE_FORMATTER.format(
            procedureDetails.appointment().getAppointmentEnd().atZone(clock.getZone())),
        new SchoolInfoLetterExaminationType(
            mapType(procedureDetails.type()),
            List.of(BACK_REGULAR, BACK_ENTRY_LEVEL)
                .contains(developmentScreening.getSchoolRecommendation())),
        mapSopessExaminationResult(sopess),
        request.note(),
        mapVaccinationResult(vaccinationStatus),
        mapEyeExaminationResult(
            eyeExaminationResult, procedure.getAnamnesis().getSpectaclesSince() != null),
        mapHearingExaminationResult(procedure.getHearingTestResult()),
        request.consultationWithCustodianRecommended(),
        mapTherapyAndPromotionInfo(procedure.getAnamnesis()),
        mapPhysiciansRecommendation(procedure.getDevelopmentScreeningResult(), request),
        new SchoolInfoLetterParentsWish(
            request.parentsWishNote(), request.referredToFurtherConsultationFromSchool()));
  }

  private Year getSchoolYear(ProcedureDetailsData procedureDetails) {
    if (featureToggle.isNewFeatureDisabled(SchoolEntryFeature.SCHOOL_YEAR)) {
      log.warn("Using current year since feature toggle is disabled");
      return Year.now(clock);
    }
    return procedureDetails.schoolYear();
  }

  private static String concat(String... parts) {
    return String.join(" ", parts);
  }

  private static Type mapType(ProcedureType type) {
    return switch (type) {
      case REGULAR_EXAMINATION -> Type.REGULAR_EXAMINATION;
      case CAN_CHILD -> Type.CAN_CHILD;
      case ENTRY_LEVEL -> Type.ENTRY_LEVEL;
      default ->
          throw new IllegalArgumentException("Unexpected value for school info letter: " + type);
    };
  }

  private static SchoolInfoLetterSchoolAndPromotionHints mapSopessExaminationResult(
      SopessExaminationResult sopess) {
    return new SchoolInfoLetterSchoolAndPromotionHints(
        mapSopessExaminationResultValue(sopess.getPsychologicalBehaviorResult()),
        mapSopessExaminationResultValue(sopess.getSpeechResult()),
        StatisticsValueMappers.articulationPointSum()
            .apply(sopess.getAllArticulationsValues())
            .map(sum -> sum > 0)
            .orElse(false),
        prepositionPointsConspicuous(sopess.getPrepositionPoints())
            || pluralPointsConspicuous(sopess.getPluralPoints()),
        mapSopessExaminationResultValue(sopess.getAuditiveProcessingResult()),
        mapSopessExaminationResultValue(sopess.getVisualPerceptionResult()),
        mapSopessExaminationResultValue(sopess.getKnowledgeThinkingResult()),
        mapSopessExaminationResultValue(sopess.getFineMotorSkills()),
        mapSopessExaminationResultValue(sopess.getGrossMotorSkills()),
        sopess.getHandednessValue() == HandednessValue.LEFT);
  }

  private static boolean mapSopessExaminationResultValue(SopessExaminationResultValue value) {
    return switch (value) {
      case KNOWN, DOCTOR_LETTER, BORDERLINE -> true;
      default -> false;
    };
  }

  private static boolean prepositionPointsConspicuous(int prepositionPoints) {
    return mapEvaluationResult(
        StatisticsValueMappers.prepositionsAssessment().apply(prepositionPoints));
  }

  private static boolean pluralPointsConspicuous(int pluralPoints) {
    return mapEvaluationResult(StatisticsValueMappers.pluralsAssessment().apply(pluralPoints));
  }

  private static boolean mapEvaluationResult(EvaluationResult evaluationResult) {
    return switch (evaluationResult) {
      case CONSPICUOUS, BORDERLINE -> true;
      case INCONSPICUOUS, UNKNOWN -> false;
    };
  }

  private static SchoolInfoLetterVaccinationInfo mapVaccinationResult(
      VaccinationStatus vaccinationStatus) {
    boolean measlesProtectionComplete = vaccinationStatus.getMmr() >= 2;
    return new SchoolInfoLetterVaccinationInfo(
        measlesProtectionComplete,
        Optional.ofNullable(vaccinationStatus.getVaccinationPassPresented())
            .map(presented -> !presented)
            .orElse(false),
        // TODO needs https://cronn-gmbh.atlassian.net/browse/ISSUE-4608 to be implemented properly
        false);
  }

  private static SchoolInfoLetterEyeExaminationInfo mapEyeExaminationResult(
      EyeExaminationResult eyeExaminationResult, boolean isSpectacleWearer) {
    boolean conspicuous =
        examinationResultsNotAllOk(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination()));
    boolean colorSenseDisorder =
        examinationResultValueIsKnownOrDoctorLetter(
            eyeExaminationResult.getIshiharaExamination().getValue());
    return new SchoolInfoLetterEyeExaminationInfo(
        conspicuous,
        mapClarificationArranged(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination())),
        isSpectacleWearer,
        mapUnderTreatment(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination())),
        colorSenseDisorder);
  }

  private static boolean examinationResultsNotAllOk(Stream<ExaminationResult> results) {
    return examinationResultValues(results)
        .anyMatch(SchoolInfoLetterExaminationMapper::examinationResultValueIsKnownOrDoctorLetter);
  }

  private static boolean examinationResultValueIsKnownOrDoctorLetter(ExaminationResultValue value) {
    return switch (value) {
      case KNOWN, DOCTOR_LETTER -> true;
      case null, default -> false;
    };
  }

  private static SchoolInfoLetterHearingExaminationInfo mapHearingExaminationResult(
      HearingTestResult hearingTestResult) {
    boolean conspicuous =
        examinationResultsNotAllOk(Stream.of(hearingTestResult.getExaminationResult()));
    return new SchoolInfoLetterHearingExaminationInfo(
        conspicuous,
        mapClarificationArranged(Stream.of(hearingTestResult.getExaminationResult())),
        mapUnderTreatment(Stream.of(hearingTestResult.getExaminationResult())));
  }

  private static boolean mapClarificationArranged(Stream<ExaminationResult> examinationResults) {
    return examinationResultValues(examinationResults)
        .anyMatch(value -> value.equals(ExaminationResultValue.DOCTOR_LETTER));
  }

  private static boolean mapUnderTreatment(Stream<ExaminationResult> examinationResults) {
    return examinationResultValues(examinationResults)
        .anyMatch(value -> value.equals(ExaminationResultValue.KNOWN));
  }

  private static Stream<ExaminationResultValue> examinationResultValues(
      Stream<ExaminationResult> results) {
    return results
        .filter(Objects::nonNull)
        .map(ExaminationResult::getValue)
        .filter(Objects::nonNull);
  }

  private static SchoolInfoLetterTherapyAndPromotionInfo mapTherapyAndPromotionInfo(
      Anamnesis anamnesis) {
    return new SchoolInfoLetterTherapyAndPromotionInfo(
        anamnesis.getSpeechTherapy(),
        anamnesis.getErgotherapy(),
        anamnesis.getPhysiotherapy(),
        // currently hardcoded value (info source was not found)
        false,
        Optional.ofNullable(anamnesis.getAdditionalTherapies())
            .map(additionalTherapies -> !additionalTherapies.isEmpty())
            .orElse(false));
  }

  private static SchoolInfoLetterPhysiciansRecommendation mapPhysiciansRecommendation(
      DevelopmentScreening result, CreateSchoolInfoLetterRequest request) {
    SchoolRecommendation schoolRecommendation = result.getSchoolRecommendation();
    return new SchoolInfoLetterPhysiciansRecommendation(
        schoolRecommendation.equals(SchoolRecommendation.CONCERNS_EARLY_ENROLMENT),
        result.getSchoolCounselling(),
        schoolRecommendation.equals(SchoolRecommendation.ADVICE_CENTER),
        mapPromotionOutsideSchool(result),
        result.getOtherSupport(),
        request.meetingBetweenYouthHealthServicesAndSchoolManagementRecommended());
  }

  private static boolean mapPromotionOutsideSchool(DevelopmentScreening result) {
    return Stream.of(
            result.getVaccinationAdvice(),
            result.getMotorPromotion(),
            result.getLanguageAdvice(),
            result.getNutritionalAdvice(),
            result.getEducationalAdvice())
        .filter(Objects::nonNull)
        .anyMatch(Boolean::booleanValue);
  }
}
