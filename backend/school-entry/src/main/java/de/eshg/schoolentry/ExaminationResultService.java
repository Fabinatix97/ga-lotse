/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.ANAMNESIS_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.DEVELOPMENT_SCREENING_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.EYE_EXAMINATION_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.HEARING_TEST_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.SOPESS_EXAMINATION_MODIFIED;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.VACCINATION_STATUS_MODIFIED;

import de.eshg.schoolentry.api.PercentilesDto;
import de.eshg.schoolentry.domain.model.Anamnesis;
import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import de.eshg.schoolentry.domain.model.EyeExaminationResult;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.SopessExaminationResult;
import de.eshg.schoolentry.domain.model.VaccinationStatus;
import de.eshg.schoolentry.domain.repository.AnamnesisRepository;
import de.eshg.schoolentry.domain.repository.DevelopmentScreeningResultRepository;
import de.eshg.schoolentry.domain.repository.EyeExaminationResultRepository;
import de.eshg.schoolentry.domain.repository.HearingTestResultRepository;
import de.eshg.schoolentry.domain.repository.SopessExaminationResultRepository;
import de.eshg.schoolentry.domain.repository.VaccinationStatusRepository;
import de.eshg.schoolentry.percentiles.PercentileCalculationService;
import de.eshg.schoolentry.util.ExceptionUtil;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import de.eshg.validation.ValidationUtil;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ExaminationResultService {

  private final HearingTestResultRepository hearingTestResultRepository;
  private final EyeExaminationResultRepository eyeExaminationResultRepository;
  private final SopessExaminationResultRepository sopessExaminationResultRepository;
  private final DevelopmentScreeningResultRepository developmentScreeningResultRepository;
  private final VaccinationStatusRepository vaccinationStatusRepository;
  private final AnamnesisRepository anamnesisRepository;
  private final PercentileCalculationService percentileCalculationService;
  private final ProgressEntryUtil progressEntryUtil;

  public ExaminationResultService(
      HearingTestResultRepository hearingTestResultRepository,
      EyeExaminationResultRepository eyeExaminationResultRepository,
      SopessExaminationResultRepository sopessExaminationResultRepository,
      DevelopmentScreeningResultRepository developmentScreeningResultRepository,
      VaccinationStatusRepository vaccinationStatusRepository,
      AnamnesisRepository anamnesisRepository,
      PercentileCalculationService percentileCalculationService,
      ProgressEntryUtil progressEntryUtil) {
    this.hearingTestResultRepository = hearingTestResultRepository;
    this.eyeExaminationResultRepository = eyeExaminationResultRepository;
    this.sopessExaminationResultRepository = sopessExaminationResultRepository;
    this.developmentScreeningResultRepository = developmentScreeningResultRepository;
    this.vaccinationStatusRepository = vaccinationStatusRepository;
    this.anamnesisRepository = anamnesisRepository;
    this.percentileCalculationService = percentileCalculationService;
    this.progressEntryUtil = progressEntryUtil;
  }

  public HearingTestResult findHearingTestResultForUpdate(UUID procedureId, long version) {
    HearingTestResult hearingTestResult =
        hearingTestResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, hearingTestResult);
    return hearingTestResult;
  }

  public HearingTestResult findHearingTestResult(UUID procedureId) {
    return hearingTestResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  public EyeExaminationResult findEyeExaminationResultForUpdate(UUID procedureId, long version) {
    EyeExaminationResult eyeExaminationResult =
        eyeExaminationResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, eyeExaminationResult);
    return eyeExaminationResult;
  }

  public EyeExaminationResult findEyeExaminationResult(UUID procedureId) {
    return eyeExaminationResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  public SopessExaminationResult findSopessExaminationResultForUpdate(
      UUID procedureId, long version) {
    SopessExaminationResult sopessExaminationResult =
        sopessExaminationResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, sopessExaminationResult);
    return sopessExaminationResult;
  }

  public SopessExaminationResult findSopessExaminationResult(UUID procedureId) {
    return sopessExaminationResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  public DevelopmentScreening findDevelopmentScreeningResultForUpdate(
      UUID procedureId, long version) {
    DevelopmentScreening developmentScreeningResult =
        developmentScreeningResultRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, developmentScreeningResult);
    return developmentScreeningResult;
  }

  public DevelopmentScreening findDevelopmentScreeningResult(UUID procedureId) {
    return developmentScreeningResultRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  public Anamnesis findAnamnesis(UUID procedureId) {
    return anamnesisRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  public Anamnesis findAnamnesisForUpdate(UUID procedureId, long version) {
    Anamnesis anamnesis =
        anamnesisRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, anamnesis);
    return anamnesis;
  }

  public VaccinationStatus findVaccinationStatusForUpdate(UUID procedureId, Long version) {
    VaccinationStatus vaccinationStatus =
        vaccinationStatusRepository
            .findByProcedureExternalIdForUpdate(procedureId)
            .orElseThrow(ExceptionUtil::procedureNotFoundException);
    ValidationUtil.validateVersion(version, vaccinationStatus);
    return vaccinationStatus;
  }

  public VaccinationStatus findVaccinationStatus(UUID procedureId) {
    return vaccinationStatusRepository
        .findByProcedureExternalId(procedureId)
        .orElseThrow(ExceptionUtil::procedureNotFoundException);
  }

  void updateHearingTestResult(
      HearingTestResult persistedHearingTestResult, HearingTestResult newHearingTestResult) {
    copyValues(newHearingTestResult, persistedHearingTestResult);

    progressEntryUtil.addProgressEntry(
        persistedHearingTestResult.getProcedure(), HEARING_TEST_MODIFIED);

    hearingTestResultRepository.flush();
  }

  private static void copyValues(HearingTestResult fromResult, HearingTestResult toResult) {
    toResult.setLeftEar(fromResult.getLeftEar());
    toResult.setRightEar(fromResult.getRightEar());
    toResult.setExaminationResult(fromResult.getExaminationResult());
    toResult.setNote(fromResult.getNote());
  }

  void updateEyeExaminationResult(
      EyeExaminationResult persistedEyeExaminationResult,
      EyeExaminationResult newEyeExaminationResult) {
    copyValues(newEyeExaminationResult, persistedEyeExaminationResult);

    progressEntryUtil.addProgressEntry(
        persistedEyeExaminationResult.getProcedure(), EYE_EXAMINATION_MODIFIED);

    eyeExaminationResultRepository.flush();
  }

  private static void copyValues(EyeExaminationResult fromResult, EyeExaminationResult toResult) {
    toResult.setLeftEye(fromResult.getLeftEye());
    toResult.setRightEye(fromResult.getRightEye());
    toResult.setEyeExamination(fromResult.getEyeExamination());
    toResult.setLangExamination(fromResult.getLangExamination());
    toResult.setIshiharaExamination(fromResult.getIshiharaExamination());
    toResult.setAmblyopia(fromResult.getAmblyopia());
    toResult.setAstigmatism(fromResult.getAstigmatism());
    toResult.setColorVisionDisorder(fromResult.getColorVisionDisorder());
    toResult.setHyperopia(fromResult.getHyperopia());
    toResult.setMyopia(fromResult.getMyopia());
    toResult.setStrabismus(fromResult.getStrabismus());
    toResult.setOtherDiagnosis(fromResult.getOtherDiagnosis());
    toResult.setNote(fromResult.getNote());
  }

  void updateSopessExaminationResult(
      SopessExaminationResult persistedSopessExaminationResult,
      SopessExaminationResult newSopessExaminationResult) {
    copyValues(newSopessExaminationResult, persistedSopessExaminationResult);

    progressEntryUtil.addProgressEntry(
        persistedSopessExaminationResult.getProcedure(), SOPESS_EXAMINATION_MODIFIED);

    sopessExaminationResultRepository.flush();
  }

  private static void copyValues(
      SopessExaminationResult fromResult, SopessExaminationResult toResult) {
    toResult.setJumpCount(fromResult.getJumpCount());
    toResult.setGrossMotorSkills(fromResult.getGrossMotorSkills());
    toResult.setDoctorLetterGrossMotorSkills(fromResult.getDoctorLetterGrossMotorSkills());
    toResult.setVisuoMotor(fromResult.getVisuoMotor());
    toResult.setFineMotorSkills(fromResult.getFineMotorSkills());
    toResult.setDoctorLetterFineMotorSkills(fromResult.getDoctorLetterFineMotorSkills());
    toResult.setHandednessValue(fromResult.getHandednessValue());
    toResult.setVisualPerceptionPoints(fromResult.getVisualPerceptionPoints());
    toResult.setVisualPerceptionResult(fromResult.getVisualPerceptionResult());
    toResult.setPrimaryLanguage(fromResult.getPrimaryLanguage());
    toResult.setGermanKnowledgePrimaryCarer(fromResult.getGermanKnowledgePrimaryCarer());
    toResult.setFamilyLanguage(fromResult.getFamilyLanguage());
    toResult.setGermanKnowledgeChild(fromResult.getGermanKnowledgeChild());
    toResult.setLettersSAndZPoints(fromResult.getLettersSAndZPoints());
    toResult.setFormationSchPoints(fromResult.getFormationSchPoints());
    toResult.setLettersTAndDPoints(fromResult.getLettersTAndDPoints());
    toResult.setFormationChPoints(fromResult.getFormationChPoints());
    toResult.setLettersGAndKPoints(fromResult.getLettersGAndKPoints());
    toResult.setLettersLAndNPoints(fromResult.getLettersLAndNPoints());
    toResult.setLetterRPoints(fromResult.getLetterRPoints());
    toResult.setLetterFAndFormationPfPoints(fromResult.getLetterFAndFormationPfPoints());
    toResult.setLetterBPoints(fromResult.getLetterBPoints());
    toResult.setFormationsTrDrKrGrPoints(fromResult.getFormationsTrDrKrGrPoints());
    toResult.setDoctorLetterVisualPerception(fromResult.getDoctorLetterVisualPerception());
    toResult.setPrepositionPoints(fromResult.getPrepositionPoints());
    toResult.setPluralPoints(fromResult.getPluralPoints());
    toResult.setSpeechResult(fromResult.getSpeechResult());
    toResult.setDoctorLetterSpeech(fromResult.getDoctorLetterSpeech());
    toResult.setPseudowordPoints(fromResult.getPseudowordPoints());
    toResult.setAuditiveProcessingResult(fromResult.getAuditiveProcessingResult());
    toResult.setDoctorLetterAuditiveProcessing(fromResult.getDoctorLetterAuditiveProcessing());
    toResult.setCountingPoints(fromResult.getCountingPoints());
    toResult.setQuantityKnowledgePoints(fromResult.getQuantityKnowledgePoints());
    toResult.setKnowledgeThinkingResult(fromResult.getKnowledgeThinkingResult());
    toResult.setDoctorLetterKnowledgeThinking(fromResult.getDoctorLetterKnowledgeThinking());
    toResult.setSelectiveAttentionPoints(fromResult.getSelectiveAttentionPoints());
    toResult.setPsychologicalBehaviorResult(fromResult.getPsychologicalBehaviorResult());
    toResult.setDoctorLetterPsychologicalBehavior(
        fromResult.getDoctorLetterPsychologicalBehavior());
    toResult.setNote(fromResult.getNote());
  }

  void updateDevelopmentScreeningResult(
      DevelopmentScreening persistedDevelopmentScreeningResult,
      DevelopmentScreening newDevelopmentScreeningResult) {
    boolean heightOrWeightWasUpdated =
        heightOrWeightWasUpdated(
            persistedDevelopmentScreeningResult, newDevelopmentScreeningResult);
    copyValues(newDevelopmentScreeningResult, persistedDevelopmentScreeningResult);
    if (heightOrWeightWasUpdated) {
      PercentilesDto dto =
          percentileCalculationService.getPercentiles(
              persistedDevelopmentScreeningResult.getProcedure(),
              newDevelopmentScreeningResult.getHeight(),
              newDevelopmentScreeningResult.getWeight());
      persistedDevelopmentScreeningResult.setHeightPercentile(dto.getHeightPercentile());
      persistedDevelopmentScreeningResult.setWeightPercentile(dto.getWeightPercentile());
      persistedDevelopmentScreeningResult.setBmi(dto.getBmi());
      persistedDevelopmentScreeningResult.setBmiPercentile(dto.getBmiPercentile());
    }

    progressEntryUtil.addProgressEntry(
        persistedDevelopmentScreeningResult.getProcedure(), DEVELOPMENT_SCREENING_MODIFIED);

    developmentScreeningResultRepository.flush();
  }

  private boolean heightOrWeightWasUpdated(
      DevelopmentScreening existing, DevelopmentScreening updated) {
    return !Objects.equals(existing.getHeight(), updated.getHeight())
        || !Objects.equals(existing.getWeight(), updated.getWeight());
  }

  private static void copyValues(DevelopmentScreening fromResult, DevelopmentScreening toResult) {
    toResult.setHeight(fromResult.getHeight());
    toResult.setWeight(fromResult.getWeight());
    toResult.setSystole(fromResult.getSystole());
    toResult.setDiastole(fromResult.getDiastole());
    toResult.setNutritionalCondition(fromResult.getNutritionalCondition());
    toResult.setNeurology(fromResult.getNeurology());
    toResult.setRespiratoryCardiovascular(fromResult.getRespiratoryCardiovascular());
    toResult.setSkin(fromResult.getSkin());
    toResult.setMusculatureSkeleton(fromResult.getMusculatureSkeleton());
    toResult.setMetabolism(fromResult.getMetabolism());
    toResult.setAbdomen(fromResult.getAbdomen());
    toResult.setEarNoseThroat(fromResult.getEarNoseThroat());
    toResult.setPhysicalExaminationNote(fromResult.getPhysicalExaminationNote());
    toResult.setChronicDisease(fromResult.getChronicDisease());
    toResult.setDisability(fromResult.getDisability());
    toResult.setDisabilityType(fromResult.getDisabilityType());
    toResult.setHandicapNote(fromResult.getHandicapNote());
    toResult.setFamily(fromResult.getFamily());
    toResult.setNonCompliance(fromResult.getNonCompliance());
    toResult.setSocial(fromResult.getSocial());
    toResult.setMigration(fromResult.getMigration());
    toResult.setOtherRisk(fromResult.getOtherRisk());
    toResult.setReIntroduction(fromResult.getReIntroduction());
    toResult.setSchoolCounselling(fromResult.getSchoolCounselling());
    toResult.setMotorPromotion(fromResult.getMotorPromotion());
    toResult.setEducationalAdvice(fromResult.getEducationalAdvice());
    toResult.setLanguageAdvice(fromResult.getLanguageAdvice());
    toResult.setNutritionalAdvice(fromResult.getNutritionalAdvice());
    toResult.setVaccinationAdvice(fromResult.getVaccinationAdvice());
    toResult.setSocialService(fromResult.getSocialService());
    toResult.setOtherSupport(fromResult.getOtherSupport());
    toResult.setInfoLetter(fromResult.getInfoLetter());
    toResult.setExtraEffort(fromResult.getExtraEffort());
    toResult.setSchoolRecommendation(fromResult.getSchoolRecommendation());
    toResult.setSchoolFeedback(fromResult.getSchoolFeedback());
  }

  void updateVaccinationStatus(
      VaccinationStatus persistedVaccinationStatus, VaccinationStatus newVaccinationStatus) {
    copyValues(newVaccinationStatus, persistedVaccinationStatus);

    progressEntryUtil.addProgressEntry(
        persistedVaccinationStatus.getProcedure(), VACCINATION_STATUS_MODIFIED);

    vaccinationStatusRepository.flush();
  }

  private static void copyValues(VaccinationStatus fromResult, VaccinationStatus toResult) {
    toResult.setVaccinationScheme(fromResult.getVaccinationScheme());
    toResult.setDiphtheria(fromResult.getDiphtheria());
    toResult.setTetanus(fromResult.getTetanus());
    toResult.setPertussis(fromResult.getPertussis());
    toResult.setHib(fromResult.getHib());
    toResult.setPolio(fromResult.getPolio());
    toResult.setHepatitisB(fromResult.getHepatitisB());
    toResult.setPneumococcus(fromResult.getPneumococcus());
    toResult.setMmr(fromResult.getMmr());
    toResult.setVaricella(fromResult.getVaricella());
    toResult.setMeningococcusB(fromResult.getMeningococcusB());
    toResult.setMeningococcusC(fromResult.getMeningococcusC());
    toResult.setRota(fromResult.getRota());
    toResult.setTbe(fromResult.getTbe());
    toResult.setHepatitisA(fromResult.getHepatitisA());
    toResult.setOtherVaccinations(fromResult.getOtherVaccinations());
    toResult.setVaccinationPassPresented(fromResult.getVaccinationPassPresented());
    toResult.setPerkombiHbv(fromResult.getPerkombiHbv());
    toResult.setMeaslesContraIndication(fromResult.getMeaslesContraIndication());
    toResult.setMeaslesContraIndicationIsPermanent(
        fromResult.getMeaslesContraIndicationIsPermanent());
    toResult.setMeaslesContraIndicationUntil(fromResult.getMeaslesContraIndicationUntil());
  }

  void updateAnamnesis(Anamnesis persistedAnamnesis, Anamnesis newAnamnesis) {
    copyValues(newAnamnesis, persistedAnamnesis);

    progressEntryUtil.addProgressEntry(persistedAnamnesis.getProcedure(), ANAMNESIS_MODIFIED);

    anamnesisRepository.flush();
  }

  public static void copyValues(Anamnesis fromAnamnesis, Anamnesis toAnamnesis) {
    toAnamnesis.setChildLanguageScreening(fromAnamnesis.getChildLanguageScreening());
    toAnamnesis.setPreliminaryCourse(fromAnamnesis.getPreliminaryCourse());
    toAnamnesis.setBirthWeight(fromAnamnesis.getBirthWeight());
    toAnamnesis.setGestationalAge(fromAnamnesis.getGestationalAge());
    toAnamnesis.setU2(fromAnamnesis.getU2());
    toAnamnesis.setU3(fromAnamnesis.getU3());
    toAnamnesis.setU4(fromAnamnesis.getU4());
    toAnamnesis.setU5(fromAnamnesis.getU5());
    toAnamnesis.setU6(fromAnamnesis.getU6());
    toAnamnesis.setU7(fromAnamnesis.getU7());
    toAnamnesis.setU7a(fromAnamnesis.getU7a());
    toAnamnesis.setU8(fromAnamnesis.getU8());
    toAnamnesis.setU9(fromAnamnesis.getU9());
    toAnamnesis.setEarlySupport(fromAnamnesis.getEarlySupport());
    toAnamnesis.setIntegrationPlace(fromAnamnesis.getIntegrationPlace());
    toAnamnesis.setErgotherapy(fromAnamnesis.getErgotherapy());
    toAnamnesis.setSpeechTherapy(fromAnamnesis.getSpeechTherapy());
    toAnamnesis.setPhysiotherapy(fromAnamnesis.getPhysiotherapy());
    toAnamnesis.setNationalityChild(fromAnamnesis.getNationalityChild());
    toAnamnesis.setCountryOfBirthChild(fromAnamnesis.getCountryOfBirthChild());
    toAnamnesis.setNationalityFirstParent(fromAnamnesis.getNationalityFirstParent());
    toAnamnesis.setCountryOfBirthFirstParent(fromAnamnesis.getCountryOfBirthFirstParent());
    toAnamnesis.setNationalitySecondParent(fromAnamnesis.getNationalitySecondParent());
    toAnamnesis.setCountryOfBirthSecondParent(fromAnamnesis.getCountryOfBirthSecondParent());
    toAnamnesis.setHasMigrationBackground(fromAnamnesis.getHasMigrationBackground());
    toAnamnesis.setInGermanySince(fromAnamnesis.getInGermanySince());
    toAnamnesis.setResponsiblePhysician(fromAnamnesis.getResponsiblePhysician());
    toAnamnesis.setNumberOfSiblings(fromAnamnesis.getNumberOfSiblings());
    toAnamnesis.setSiblingsBirthYears(fromAnamnesis.getSiblingsBirthYears());
    toAnamnesis.setWasInDaycare(fromAnamnesis.getWasInDaycare());
    toAnamnesis.setInDaycareSince(fromAnamnesis.getInDaycareSince());
    toAnamnesis.setDaycareName(fromAnamnesis.getDaycareName());
    toAnamnesis.setSchoolName(fromAnamnesis.getSchoolName());
    toAnamnesis.setSpectaclesInFamily(fromAnamnesis.getSpectaclesInFamily());
    toAnamnesis.setChronicIllnessOrDisabilityInFamily(
        fromAnamnesis.getChronicIllnessOrDisabilityInFamily());
    toAnamnesis.setDevelopmentConspicuities(fromAnamnesis.getDevelopmentConspicuities());
    toAnamnesis.setInfancyConspicuities(fromAnamnesis.getInfancyConspicuities());
    toAnamnesis.setSevereIllnesses(fromAnamnesis.getSevereIllnesses());
    toAnamnesis.setAllergies(fromAnamnesis.getAllergies());
    toAnamnesis.setHospitalizationsOrOperations(fromAnamnesis.getHospitalizationsOrOperations());
    toAnamnesis.setUnderMedicalTreatmentFor(fromAnamnesis.getUnderMedicalTreatmentFor());
    toAnamnesis.setRegularMedication(fromAnamnesis.getRegularMedication());
    toAnamnesis.setVisionImpairment(fromAnamnesis.getVisionImpairment());
    toAnamnesis.setHearingImpairment(fromAnamnesis.getHearingImpairment());
    toAnamnesis.setSpeechImpairment(fromAnamnesis.getSpeechImpairment());
    toAnamnesis.setSpectaclesSince(fromAnamnesis.getSpectaclesSince());
    toAnamnesis.setVisionSchoolSince(fromAnamnesis.getVisionSchoolSince());
    toAnamnesis.setHearingAid(fromAnamnesis.getHearingAid());
    toAnamnesis.setSpeechTherapyStart(fromAnamnesis.getSpeechTherapyStart());
    toAnamnesis.setSpeechTherapyEnd(fromAnamnesis.getSpeechTherapyEnd());
    toAnamnesis.setErgoTherapyStart(fromAnamnesis.getErgoTherapyStart());
    toAnamnesis.setErgoTherapyEnd(fromAnamnesis.getErgoTherapyEnd());
    toAnamnesis.setPhysioTherapyStart(fromAnamnesis.getPhysioTherapyStart());
    toAnamnesis.setPhysioTherapyEnd(fromAnamnesis.getPhysioTherapyEnd());
    toAnamnesis.setAdditionalTherapies(fromAnamnesis.getAdditionalTherapies());
    toAnamnesis.setClubSport(fromAnamnesis.getClubSport());
    toAnamnesis.setOtherInterests(fromAnamnesis.getOtherInterests());
    toAnamnesis.setCanSwim(fromAnamnesis.getCanSwim());
    toAnamnesis.setHasSeahorseBadge(fromAnamnesis.getHasSeahorseBadge());
    toAnamnesis.setPersonalConspicuities(fromAnamnesis.getPersonalConspicuities());
  }
}
