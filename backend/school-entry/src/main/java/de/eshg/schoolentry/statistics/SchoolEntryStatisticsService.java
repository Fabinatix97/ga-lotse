/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import static de.eshg.schoolentry.statistics.DevelopmentScreeningStatistics.*;
import static java.lang.Math.abs;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.statistics.AbstractStatisticsService;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.SubjectType;
import de.eshg.lib.statistics.util.AttributeInfo;
import de.eshg.lib.statistics.util.DataSourceInfo;
import de.eshg.schoolentry.api.CountryCodeDto;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.statistics.options.*;
import de.eshg.schoolentry.statistics.options.BooleanWithUnknown;
import de.eshg.schoolentry.statistics.options.DoctorLetterValue;
import jakarta.annotation.Nullable;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.Temporal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryStatisticsService extends AbstractStatisticsService<SchoolEntryProcedure> {

  public static final DateTimeFormatter DATE_FORMAT =
      DateTimeFormatter.ofPattern("MM.yyyy", Locale.GERMANY);

  public static final UUID SCHOOL_ENTRY_DATA_SOURCE_ID =
      UUID.fromString("5bee6747-9cbc-423c-a192-ad978d45970c");

  private final Clock clock;

  public SchoolEntryStatisticsService(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository, Clock clock) {
    super(schoolEntryProcedureRepository);
    this.clock = clock;
  }

  @Override
  public List<DataSourceInfo> getDataSourceMetaInfos() {
    return List.of(
        new DataSourceInfo(
            SCHOOL_ENTRY_DATA_SOURCE_ID, "ESU", DataSourceSensitivity.SENSITIVE, false));
  }

  @Override
  protected Map<UUID, List<AttributeInfo>> getDataSourceIdToAttributeInfos() {
    return Map.of(SCHOOL_ENTRY_DATA_SOURCE_ID, Arrays.asList(EsuAttributes.values()));
  }

  @Override
  protected SubjectType getSubjectType(AttributeInfo attributeInfo) {
    return SubjectType.PERSON;
  }

  @Override
  protected Specification<SchoolEntryProcedure> getProcedureSpecification(
      Instant startTimestamp, Instant endTimestamp) {
    return (root, query, criteriaBuilder) -> {
      Path<LocalDate> examinationDatePath = root.get(SchoolEntryProcedure_.examinationDate);

      Predicate examinationDateInTimeRange =
          isInTimeRangeIfPresent(
              criteriaBuilder,
              examinationDatePath,
              toLocalDate(startTimestamp),
              toLocalDate(endTimestamp));

      Path<Instant> appointmentStartPath =
          root.join(SchoolEntryProcedure_.appointment, JoinType.LEFT)
              .get(Appointment_.appointmentStart);

      Predicate appointmentStartInTimeRange =
          isInTimeRangeIfPresent(
              criteriaBuilder, appointmentStartPath, startTimestamp, endTimestamp);

      // Paranoia check - this should be true for all closed procedures
      Predicate examinationDateOrAppointmentStartNotNull =
          criteriaBuilder.or(
              criteriaBuilder.isNotNull(examinationDatePath),
              criteriaBuilder.isNotNull(appointmentStartPath));

      Predicate isClosed =
          criteriaBuilder.equal(root.get(Procedure_.procedureStatus), ProcedureStatus.CLOSED);

      Predicate isCanChild =
          criteriaBuilder.equal(root.get(Procedure_.procedureType), ProcedureType.CAN_CHILD);

      Path<SchoolFeedback> schoolFeedbackPath =
          root.join(SchoolEntryProcedure_.developmentScreeningResult)
              .get(DevelopmentScreening_.schoolFeedback);

      Predicate hasNegativeFeedback =
          criteriaBuilder.and(
              criteriaBuilder.isNotNull(schoolFeedbackPath),
              criteriaBuilder.equal(schoolFeedbackPath, SchoolFeedback.NEGATIVE));

      Predicate isNotCanChildWithNegativeFeedback =
          criteriaBuilder.not(criteriaBuilder.and(isCanChild, hasNegativeFeedback));

      return criteriaBuilder.and(
          examinationDateInTimeRange,
          appointmentStartInTimeRange,
          examinationDateOrAppointmentStartNotNull,
          isClosed,
          isNotCanChildWithNegativeFeedback);
    };
  }

  private LocalDate toLocalDate(Instant instant) {
    return instant.atZone(clock.getZone()).toLocalDate();
  }

  private <T extends Temporal & Comparable<? super T>> Predicate isInTimeRangeIfPresent(
      CriteriaBuilder criteriaBuilder,
      Expression<T> temporalPath,
      T startInclusive,
      T endExclusive) {
    return criteriaBuilder.or(
        criteriaBuilder.isNull(temporalPath),
        criteriaBuilder.and(
            criteriaBuilder.greaterThanOrEqualTo(temporalPath, startInclusive),
            criteriaBuilder.lessThan(temporalPath, endExclusive)));
  }

  @Override
  protected Object getSpecificValue(
      SchoolEntryProcedure procedure,
      AttributeInfo attributeInfo,
      UUID dataSourceId,
      boolean anonymized) {
    EsuAttributes attribute = (EsuAttributes) attributeInfo;
    return switch (attribute) {
      case CHILD_CENTRAL_FILE_ID -> procedure.getChildIdFromCentralFile();
      case PROCEDURE_ID -> procedure.getExternalId();
      case KIND -> getProcedureType(procedure);
      case UNTERSDAT -> getAppointmentOrExaminationDate(procedure);
      case KT -> getDaycareValue(procedure);
      case KISS -> getAnamnesisAttribute(procedure, Anamnesis::getChildLanguageScreening);
      case VLK -> getAnamnesisAttribute(procedure, Anamnesis::getPreliminaryCourse);
      case GG -> getAnamnesisAttribute(procedure, Anamnesis::getBirthWeight);
      case SSW_DAUER -> getAnamnesisAttribute(procedure, Anamnesis::getGestationalAge);
      case KIH -> getAnamnesisAttribute(procedure, Anamnesis::getNumberOfSiblings);
      case U2E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU2);
      case U3E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU3);
      case U4E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU4);
      case U5E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU5);
      case U6E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU6);
      case U7A -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU7a);
      case U7E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU7);
      case U8E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU8);
      case U9E -> getAnamnesisCheckUpsAttribute(procedure, Anamnesis::getU9);
      case FF -> getAnamnesisAttribute(procedure, Anamnesis::getEarlySupport);
      case IP -> getAnamnesisAttribute(procedure, Anamnesis::getIntegrationPlace);
      case ERGO -> getAnamnesisAttribute(procedure, Anamnesis::getErgotherapy);
      case LOGO -> getAnamnesisAttribute(procedure, Anamnesis::getSpeechTherapy);
      case KG -> getAnamnesisAttribute(procedure, Anamnesis::getPhysiotherapy);
      case STAKI_TEXT -> getCountryName(procedure, Anamnesis::getNationalityChild);
      case STAKI_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getNationalityChild);
      case STAKI -> getCountryCode(procedure, Anamnesis::getNationalityChild);
      case GEBKI_LKZ -> getAnamnesisAttribute(procedure, Anamnesis::getCountryOfBirthChild);
      case GEBKI_TEXT -> getCountryName(procedure, Anamnesis::getCountryOfBirthChild);
      case GEBKI -> getCountryCode(procedure, Anamnesis::getCountryOfBirthChild);
      case STAET1_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getNationalityFirstParent);
      case STAET1_TEXT -> getCountryName(procedure, Anamnesis::getNationalityFirstParent);
      case STAET1 -> getCountryCode(procedure, Anamnesis::getNationalityFirstParent);
      case GEBET1_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getCountryOfBirthFirstParent);
      case GEBET1_TEXT -> getCountryName(procedure, Anamnesis::getCountryOfBirthFirstParent);
      case GEBET1 -> getCountryCode(procedure, Anamnesis::getCountryOfBirthFirstParent);
      case STAET2_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getNationalitySecondParent);
      case STAET2_TEXT -> getCountryName(procedure, Anamnesis::getNationalitySecondParent);
      case STAET2 -> getCountryCode(procedure, Anamnesis::getNationalitySecondParent);
      case GEBET2_FFM -> getAnamnesisAttribute(procedure, Anamnesis::getCountryOfBirthSecondParent);
      case GEBET2_TEXT -> getCountryName(procedure, Anamnesis::getCountryOfBirthSecondParent);
      case GEBET2 -> getCountryCode(procedure, Anamnesis::getCountryOfBirthSecondParent);
      case MIG -> getAnamnesisAttribute(procedure, Anamnesis::getHasMigrationBackground);
      case WOHND -> getInGermanySinceAttribute(procedure);
      case AUDIO ->
          getExaminationResultFourOptionValue(
              procedure.getHearingTestResult(), HearingTestResult::getExaminationResult);
      case KW_RM_AUDIO ->
          getExaminationResponseDoctorLetterValue(
              procedure.getHearingTestResult(), HearingTestResult::getExaminationResult);
      case GROE ->
          getDevelopmentScreeningAttributeOrUnknownInteger(
              procedure, DevelopmentScreening::getHeight);
      case GROE_PERZ ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getHeightPercentile);
      case GEWI -> getWeight(procedure);
      case GEWI_PERZ ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getWeightPercentile);
      case BMI -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getBmi);
      case BMI_PERZ ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getBmiPercentile);
      case RRSYS ->
          getDevelopmentScreeningAttributeOrUnknownInteger(
              procedure, DevelopmentScreening::getSystole);
      case RRDIA ->
          getDevelopmentScreeningAttributeOrUnknownInteger(
              procedure, DevelopmentScreening::getDiastole);
      case KOERPERCHECK -> getAllPhysicalExamination(procedure.getDevelopmentScreeningResult());
      case EZ ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getNutritionalCondition);
      case RM_ERNAEHRUNGSZUSTAND ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getNutritionalCondition);
      case NEU ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getNeurology);
      case RM_NEUROLOGIE ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getNeurology);
      case AHK ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getRespiratoryCardiovascular);
      case RM_ATMUNG_HERZ_KREISLAUF ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getRespiratoryCardiovascular);
      case DERM ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getSkin);
      case RM_HAUT ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getSkin);
      case MUSK ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getMusculatureSkeleton);
      case RM_MUSKULATUR_SKELETT ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getMusculatureSkeleton);
      case ENDO ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getMetabolism);
      case RM_ENDO_STOFFW ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getMetabolism);
      case ABD ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getAbdomen);
      case RM_ABDOMEN ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getAbdomen);
      case HNO ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getEarNoseThroat);
      case RM_HNO ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getEarNoseThroat);
      case HANDCAP -> getAllHandicap(procedure);
      case CHKR ->
          getHandicapWithDiagnosisValue(procedure, DevelopmentScreening::getChronicDisease);
      case DIAGCH1 -> getHandicapIcd10Codes(0, procedure, DevelopmentScreening::getChronicDisease);
      case DIAGCH2 -> getHandicapIcd10Codes(1, procedure, DevelopmentScreening::getChronicDisease);
      case DIAGCH3 -> getHandicapIcd10Codes(2, procedure, DevelopmentScreening::getChronicDisease);
      case BEHI -> getHandicapWithDiagnosisValue(procedure, DevelopmentScreening::getDisability);
      case BEHIART -> getDisabilityType(procedure);
      case DIAGB1 -> getHandicapIcd10Codes(0, procedure, DevelopmentScreening::getDisability);
      case DIAGB2 -> getHandicapIcd10Codes(1, procedure, DevelopmentScreening::getDisability);
      case DIAGB3 -> getHandicapIcd10Codes(2, procedure, DevelopmentScreening::getDisability);
      case PSYSOZRISK -> getAllPsychoSozialRisk(procedure.getDevelopmentScreeningResult());
      case FAMILIE -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getFamily);
      case NONCOMP ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getNonCompliance);
      case SOZIAL -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getSocial);
      case MIGRATION ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getMigration);
      case SONSTIGES_RISIKO ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getOtherRisk);
      case MASSN -> getAllSocioEducationalPerformance(procedure.getDevelopmentScreeningResult());
      case WSPR ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getReIntroduction);
      case SCHB ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getSchoolCounselling);
      case MOTO ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getMotorPromotion);
      case ERZB ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getEducationalAdvice);
      case SPRF ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getLanguageAdvice);
      case ERNB ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getNutritionalAdvice);
      case IMPF ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getVaccinationAdvice);
      case SOZD ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getSocialService);
      case SOHI ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getOtherSupport);
      case INFO -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getInfoLetter);
      case SCHULEMPF -> getSchoolRecommendation(procedure);
      case MEHR ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getExtraEffort);
      case VISCH ->
          getExaminationResultFourOptionValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getEyeExamination);
      case KW_RM_VISUS ->
          getExaminationResponseDoctorLetterValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getEyeExamination);
      case VISTR ->
          getExaminationResultFourOptionValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getLangExamination);
      case KW_RM_VISTR ->
          getExaminationResponseDoctorLetterValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getLangExamination);
      case FARB ->
          getExaminationResultFourOptionValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getIshiharaExamination);
      case KW_RM_FARB ->
          getExaminationResponseDoctorLetterValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getIshiharaExamination);
      case KW_AMBLYOPIE ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getAmblyopia);
      case KW_ASTIGMATISMUS ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getAstigmatism);
      case KW_STOER_FARBS ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getColorVisionDisorder);
      case KW_HYPEROPIE ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getHyperopia);
      case KW_MYOPIE -> getEyeExaminationAttribute(procedure, EyeExaminationResult::getMyopia);
      case KW_STRABISM ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getStrabismus);
      case KW_AND_DIAGN ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getOtherDiagnosis);
      case IMPFSCHEMA -> getVaccinationScheme(procedure.getVaccinationStatus());
      case DIP -> getVaccinationAttribute(procedure, VaccinationStatus::getDiphtheria);
      case TET -> getVaccinationAttribute(procedure, VaccinationStatus::getTetanus);
      case PER -> getVaccinationAttribute(procedure, VaccinationStatus::getPertussis);
      case HIB -> getVaccinationAttribute(procedure, VaccinationStatus::getHib);
      case POL -> getVaccinationAttribute(procedure, VaccinationStatus::getPolio);
      case HBV -> getVaccinationAttribute(procedure, VaccinationStatus::getHepatitisB);
      case PNEUMO -> getVaccinationAttribute(procedure, VaccinationStatus::getPneumococcus);
      case MMR -> getVaccinationAttribute(procedure, VaccinationStatus::getMmr);
      case VARI -> getVaccinationAttribute(procedure, VaccinationStatus::getVaricella);
      case MENB -> getVaccinationAttribute(procedure, VaccinationStatus::getMeningococcusB);
      case MENC -> getVaccinationAttribute(procedure, VaccinationStatus::getMeningococcusC);
      case ROTA -> getVaccinationAttribute(procedure, VaccinationStatus::getRota);
      case FSME -> getVaccinationAttribute(procedure, VaccinationStatus::getTbe);
      case HAV -> getVaccinationAttribute(procedure, VaccinationStatus::getHepatitisA);
      case IMPFBUCH -> getVaccinationPassPresented(procedure.getVaccinationStatus());
      case PERKOMBIHBV -> getPerkombiHbv(procedure.getVaccinationStatus());
      case KOORD -> getSopessExaminationAttribute(procedure, SopessExaminationResult::getJumpCount);
      case KOORD1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getJumpCount,
              StatisticsValueMappers.jumpCountAssessment().andThen(EvaluationResult::getValue));
      case GROMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getGrossMotorSkills,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter());
      case KW_RM_GROMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterGrossMotorSkills,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case VISMOT ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getVisuoMotor);
      case VISMOT1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getVisuoMotor,
              StatisticsValueMappers.visuoMotorAssessment().andThen(EvaluationResult::getValue));
      case FEIMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFineMotorSkills,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter());
      case KW_RM_FEIMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterFineMotorSkills,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case VISPER ->
          getSopessExaminationAttribute(
              procedure, SopessExaminationResult::getVisualPerceptionPoints);
      case VISPER1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getVisualPerceptionPoints,
              StatisticsValueMappers.visualPerceptionAssessment()
                  .andThen(EvaluationResult::getValue));
      case VISWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getVisualPerceptionResult,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter());
      case KW_RM_VISWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterVisualPerception,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case PRAEP ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getPrepositionPoints);
      case PRAEP1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPrepositionPoints,
              StatisticsValueMappers.prepositionsAssessment().andThen(EvaluationResult::getValue));
      case PLUR ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getPluralPoints);
      case PLUR1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPluralPoints,
              StatisticsValueMappers.pluralsAssessment().andThen(EvaluationResult::getValue));
      case SPR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getSpeechResult,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter());
      case KW_RM_SPR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterSpeech,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case PSWOE ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getPseudowordPoints);
      case PSWOE1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPseudowordPoints,
              StatisticsValueMappers.pseudoWordAssessment().andThen(EvaluationResult::getValue));
      case AUDWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getAuditiveProcessingResult,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter());
      case KW_RM_AUSWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterAuditiveProcessing,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case ZAEHL ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getCountingPoints);
      case ZAEHL1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getCountingPoints,
              StatisticsValueMappers.countingAssessment().andThen(EvaluationResult::getValue));
      case MENG ->
          getSopessExaminationAttribute(
              procedure, SopessExaminationResult::getQuantityKnowledgePoints);
      case MENG1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getQuantityKnowledgePoints,
              StatisticsValueMappers.quantityKnowledgeAssessment()
                  .andThen(EvaluationResult::getValue));
      case WISSDE ->
          getSopessExaminationAttribute(
              procedure,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter()
                  .compose(SopessExaminationResult::getKnowledgeThinkingResult));
      case KW_RM_WISSDE ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterKnowledgeThinking,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case SELAUFM ->
          getSopessExaminationAttribute(
              procedure, SopessExaminationResult::getSelectiveAttentionPoints);
      case SELAUFM1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getSelectiveAttentionPoints,
              StatisticsValueMappers.selectiveAttentionAssessment()
                  .andThen(EvaluationResult::getValue));
      case PSYVER ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPsychologicalBehaviorResult,
              StatisticsValueMappers.sopessExaminationResultToStatisticsLetter());
      case KW_RM_PSYVER ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterKnowledgeThinking,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case HAND ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getHandednessValue);
      case ESPR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPrimaryLanguage,
              StatisticsValueMappers.primaryLanguageToStatisticsLetter());
      case SPRBP -> getGermanKnowledgePrimaryCarer(procedure.getSopessExaminationResult());
      case FAMSPR -> getFamilyLanguage(procedure.getSopessExaminationResult());
      case SPRDEU -> getGermanKnowledgeChild(procedure.getSopessExaminationResult());
      case DYS_S_Z ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersSAndZPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_SCH ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFormationSchPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_T_D ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersTAndDPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_CH ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFormationChPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_G_K ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersGAndKPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_L_N ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersLAndNPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_R ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLetterRPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_F_PF ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLetterFAndFormationPfPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS_TR_DR_KR_GR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFormationsTrDrKrGrPoints,
              StatisticsValueMappers.articulationValueToStatisticsLetter());
      case DYS ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getAllArticulationsValues,
              StatisticsValueMappers.articulationPointSum().andThen(sum -> sum.orElse(null)));
      case DYS1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getAllArticulationsValues,
              StatisticsValueMappers.articulationPointSum()
                  .andThen(StatisticsValueMappers.articulationPointSumAssessment()));
      default -> null;
    };
  }

  private String getDaycareValue(SchoolEntryProcedure procedure) {
    if (procedure.getAppointment() == null
        || procedure.getAppointment().getAppointmentStart() == null
        || procedure.getAnamnesis() == null) {
      return null;
    }

    Boolean wasInDaycare = procedure.getAnamnesis().getWasInDaycare();
    if (Boolean.FALSE.equals(wasInDaycare)) {
      return Daycare.NO.getValue();
    }

    LocalDate inDaycareSince = procedure.getAnamnesis().getInDaycareSince();
    if (wasInDaycare == null || inDaycareSince == null) {
      return Daycare.UNKNOWN.getValue();
    }

    LocalDate appointmentDate =
        procedure.getAppointment().getAppointmentStart().atZone(clock.getZone()).toLocalDate();

    return getDaycareValue(appointmentDate, inDaycareSince);
  }

  public static String getDaycareValue(LocalDate appointmentDate, LocalDate inDaycareSince) {
    Period timeDifference = Period.between(appointmentDate, inDaycareSince);
    int months = abs(timeDifference.getYears() * 12 + timeDifference.getMonths());
    if (months < 18) {
      return Daycare.MONTH_18.getValue();
    } else if (months < 36) {
      return Daycare.MONTH_18_TO_YEARS_3.getValue();
    } else {
      return Daycare.YEARS_3.getValue();
    }
  }

  private @Nullable String getProcedureType(SchoolEntryProcedure procedure) {
    if (procedure == null) {
      return null;
    }

    return Child.convertTypeToValue(procedure.getProcedureType());
  }

  private @Nullable String getAppointmentOrExaminationDate(SchoolEntryProcedure procedure) {
    if (procedure == null
        || (procedure.getAppointment() == null && procedure.getExaminationDate() == null)) {
      return null;
    }
    if (procedure.getExaminationDate() != null) {
      return procedure.getExaminationDate().format(DATE_FORMAT);
    } else {
      return procedure
          .getAppointment()
          .getAppointmentStart()
          .atZone(clock.getZone())
          .format(DATE_FORMAT);
    }
  }

  private <T> @Nullable String getExaminationResultFourOptionValue(
      T testResult, Function<T, ExaminationResult> getExaminationResult) {

    if (testResult == null || getExaminationResult.apply(testResult) == null) {
      return null;
    } else {
      ExaminationResultValue examinationResultValue =
          getExaminationResult.apply(testResult).getValue();
      return ExaminationResultFourOptions.convertExaminationResultToValue(examinationResultValue);
    }
  }

  private <T> @Nullable String getExaminationResponseDoctorLetterValue(
      T testResult, Function<T, ExaminationResult> getExaminationResult) {
    if (testResult == null || getExaminationResult.apply(testResult) == null) {
      return null;
    } else {

      de.eshg.schoolentry.domain.model.DoctorLetterValue doctorLetterValue =
          getExaminationResult.apply(testResult).getDoctorLetter();
      return DoctorLetterValue.convertDoctorLetterValueToValue(doctorLetterValue);
    }
  }

  private <T> @Nullable T getEyeExaminationAttribute(
      SchoolEntryProcedure procedure, Function<EyeExaminationResult, T> eyeExaminationGetter) {
    EyeExaminationResult eyeExaminationResult = procedure.getEyeExaminationResult();
    if (eyeExaminationResult == null) {
      return null;
    }
    return eyeExaminationGetter.apply(eyeExaminationResult);
  }

  private String getVaccinationAttribute(
      SchoolEntryProcedure procedure, Function<VaccinationStatus, Integer> vaccinationGetter) {
    VaccinationStatus vaccinationStatus = procedure.getVaccinationStatus();
    if (vaccinationStatus == null) {
      return null;
    }

    Integer vaccinations = vaccinationGetter.apply(vaccinationStatus);
    return vaccinations == null ? null : String.format("%d", vaccinations);
  }

  private @Nullable Boolean getVaccinationPassPresented(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null) {
      return null;
    }

    return vaccinationStatus.getVaccinationPassPresented();
  }

  private @Nullable String getVaccinationScheme(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null || vaccinationStatus.getVaccinationScheme() == null) {
      return null;
    }

    return VaccinationScheme.convertVaccinationSchemeToValue(
        vaccinationStatus.getVaccinationScheme());
  }

  private @Nullable String getPerkombiHbv(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null) {
      return null;
    }

    return BooleanWithUnknown.convertToValue(vaccinationStatus.getPerkombiHbv());
  }

  private <T> @Nullable T getAnamnesisAttribute(
      SchoolEntryProcedure procedure, Function<Anamnesis, T> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null) {
      return null;
    }
    return anamnesisGetter.apply(anamnesis);
  }

  private @Nullable String getAnamnesisCheckUpsAttribute(
      SchoolEntryProcedure procedure,
      Function<Anamnesis, de.eshg.schoolentry.domain.model.BooleanWithUnknown> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null) {
      return null;
    }
    return BooleanWithUnknown.convertToValue(anamnesisGetter.apply(anamnesis));
  }

  private @Nullable String getCountryCode(
      SchoolEntryProcedure procedure, Function<Anamnesis, CountryCode> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null || anamnesisGetter.apply(anamnesis) == null) {
      return null;
    }
    Map<String, Integer> countryCodes =
        Arrays.stream(CountryCodeDto.values())
            .collect(Collectors.toMap(Enum::name, CountryCodeDto::getCountryGroupCode));
    CountryCode countryCode = anamnesisGetter.apply(anamnesis);
    return Country.convertCountryCodeToValue(countryCodes.get(countryCode.name()));
  }

  private @Nullable String getCountryName(
      SchoolEntryProcedure procedure, Function<Anamnesis, CountryCode> anamnesisGetter) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null || anamnesisGetter.apply(anamnesis) == null) {
      return null;
    }
    return CountryName.valueOf(anamnesisGetter.apply(anamnesis).name()).getName();
  }

  private @Nullable String getInGermanySinceAttribute(SchoolEntryProcedure procedure) {
    Anamnesis anamnesis = procedure.getAnamnesis();
    if (anamnesis == null) {
      return null;
    }
    if (anamnesis.getInGermanySince() == null) {
      return "";
    }
    return anamnesis.getInGermanySince().format(DATE_FORMAT);
  }

  private <T> @Nullable T getSopessExaminationAttribute(
      SchoolEntryProcedure procedure, Function<SopessExaminationResult, T> sopessGetter) {
    return Optional.ofNullable(procedure.getSopessExaminationResult())
        .flatMap(result -> Optional.ofNullable(sopessGetter.apply(result)))
        .orElse(null);
  }

  private String getFamilyLanguage(SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }

    String value =
        Language.convertFamilyLanguageToValue(sopessExaminationResult.getFamilyLanguage());

    if (value == null && hasGermanPrimaryLanguage(sopessExaminationResult)) {
      return Language.VALUE_99.getValue();
    } else return value;
  }

  private String getGermanKnowledgePrimaryCarer(SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }

    String value =
        GuardianLanguageKnowledge.convertLanguageKnowledgeToValue(
            sopessExaminationResult.getGermanKnowledgePrimaryCarer());

    if (value == null && hasGermanPrimaryLanguage(sopessExaminationResult)) {
      return GuardianLanguageKnowledge.VALUE_9.getValue();
    } else return value;
  }

  private static boolean hasGermanPrimaryLanguage(SopessExaminationResult sopessExaminationResult) {
    return sopessExaminationResult.getPrimaryLanguage() == PrimaryLanguageValue.GERMAN;
  }

  private String getGermanKnowledgeChild(SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }

    String value =
        ChildLanguageKnowledge.convertChildLanguageKnowledgeToValue(
            sopessExaminationResult.getGermanKnowledgeChild());

    if (value == null && hasGermanPrimaryLanguage(sopessExaminationResult)) {
      return ChildLanguageKnowledge.VALUE_9.getValue();
    } else return value;
  }

  private <T, E> @Nullable E getSopessExaminationAttribute(
      SchoolEntryProcedure procedure,
      Function<SopessExaminationResult, T> sopessGetter,
      Function<T, E> mapFn) {
    return Optional.ofNullable(procedure.getSopessExaminationResult())
        .flatMap(result -> Optional.ofNullable(sopessGetter.apply(result)))
        .map(mapFn)
        .orElse(null);
  }
}
