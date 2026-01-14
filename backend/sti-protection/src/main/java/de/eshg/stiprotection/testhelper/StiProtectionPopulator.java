/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.GenderDto;
import de.eshg.stiprotection.ConsultationController;
import de.eshg.stiprotection.DiagnosisController;
import de.eshg.stiprotection.ExaminationController;
import de.eshg.stiprotection.MedicalHistoryController;
import de.eshg.stiprotection.StiProtectionProcedureController;
import de.eshg.stiprotection.WaitingRoomController;
import de.eshg.stiprotection.api.AppointmentBookingTypeDto;
import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.consultation.ConsultationDto;
import de.eshg.stiprotection.api.consultation.GeneralSectionDto;
import de.eshg.stiprotection.api.consultation.PregnancySectionDto;
import de.eshg.stiprotection.api.diagnosis.DiagnosisDto;
import de.eshg.stiprotection.api.diagnosis.MedicationDto;
import de.eshg.stiprotection.api.diagnosis.TestTypeDto;
import de.eshg.stiprotection.api.examination.LaboratoryTestExaminationDto;
import de.eshg.stiprotection.api.examination.RapidTestDataDto;
import de.eshg.stiprotection.api.examination.RapidTestExaminationDto;
import de.eshg.stiprotection.api.examination.labtests.CancerScreeningTestDto;
import de.eshg.stiprotection.api.examination.labtests.ChlamydiaTestDto;
import de.eshg.stiprotection.api.examination.labtests.GonorrheaTestDto;
import de.eshg.stiprotection.api.examination.labtests.HepatitisATestDto;
import de.eshg.stiprotection.api.examination.labtests.HepatitisBTestDto;
import de.eshg.stiprotection.api.examination.labtests.HepatitisCTestDto;
import de.eshg.stiprotection.api.examination.labtests.HivTestDto;
import de.eshg.stiprotection.api.examination.labtests.HpvTestDto;
import de.eshg.stiprotection.api.examination.labtests.LabTestDataDto;
import de.eshg.stiprotection.api.examination.labtests.MpoxTestDto;
import de.eshg.stiprotection.api.examination.labtests.MycoplasmaTestDto;
import de.eshg.stiprotection.api.examination.labtests.OtherTestsDto;
import de.eshg.stiprotection.api.examination.labtests.SyphilisTestDto;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryRequest;
import de.eshg.stiprotection.api.medicalhistory.ExaminationDto;
import de.eshg.stiprotection.api.medicalhistory.PartnerRiskFactorDto;
import de.eshg.stiprotection.api.medicalhistory.PreventionDto;
import de.eshg.stiprotection.api.medicalhistory.PreviousIllnessDto;
import de.eshg.stiprotection.api.medicalhistory.ProtectionMethodDto;
import de.eshg.stiprotection.api.medicalhistory.RelationshipModelDto;
import de.eshg.stiprotection.api.medicalhistory.RiskContactDto;
import de.eshg.stiprotection.api.medicalhistory.RiskFactorDto;
import de.eshg.stiprotection.api.medicalhistory.SafeSexPracticeDto;
import de.eshg.stiprotection.api.medicalhistory.SexWorkLocationDto;
import de.eshg.stiprotection.api.medicalhistory.SexWorkMedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.SexWorkRiskContactDto;
import de.eshg.stiprotection.api.medicalhistory.SexualOrientationDto;
import de.eshg.stiprotection.api.medicalhistory.StiConsultationMedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.VaccinationDto;
import de.eshg.stiprotection.api.waitingroom.WaitingRoomDto;
import de.eshg.stiprotection.api.waitingroom.WaitingStatusDto;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.IntStream;
import net.datafaker.Faker;
import org.springframework.util.CollectionUtils;

@PopulatorComponent
public class StiProtectionPopulator extends BasePopulator<CreateProcedureResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final StiProtectionProcedureController stiProtectionProcedureController;
  private final DiagnosisController diagnosisController;
  private final ExaminationController examinationController;
  private final WaitingRoomController waitingRoomController;
  private final StiProtectionProcedureRepository stiProtectionProcedureRepository;
  private final ConsultationController consultationController;
  private final MedicalHistoryController medicalHistoryController;

  public StiProtectionPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      StiProtectionProcedureController stiProtectionProcedureController,
      DiagnosisController diagnosisController,
      ExaminationController examinationController,
      StiProtectionProcedureRepository stiProtectionProcedureRepository,
      WaitingRoomController waitingRoomController,
      ConsultationController consultationController,
      MedicalHistoryController medicalHistoryController) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(StiProtectionProcedure.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.stiProtectionProcedureController = stiProtectionProcedureController;
    this.diagnosisController = diagnosisController;
    this.examinationController = examinationController;
    this.waitingRoomController = waitingRoomController;
    this.stiProtectionProcedureRepository = stiProtectionProcedureRepository;
    this.consultationController = consultationController;
    this.medicalHistoryController = medicalHistoryController;
  }

  @Override
  public ListWithTotalNumber<CreateProcedureResponse> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected CreateProcedureResponse populate(
      int index,
      Faker faker,
      BasePopulator<CreateProcedureResponse>.UniqueValueProvider uniqueValueProvider) {

    ConcernDto concern = concern(faker);

    CreateProcedureResponse resp = createBasePopulatedProcedure(faker, concern);

    populateTestExaminations(faker, resp.procedureId());

    populateDiagnosis(faker, resp.procedureId());

    consultationController.updateConsultation(
        resp.procedureId(), new ConsultationDto(consultationGeneral(faker), pregnancy(faker)));

    populateMedicalHistory(faker, resp.procedureId(), concern);

    // Move into waiting room
    if (faker.bool().bool()) {
      waitingRoomController.updateWaitingRoomDetails(
          resp.procedureId(),
          new WaitingRoomDto(faker.simpsons().location(), waitingStatus(faker)));
    }

    return resp;
  }

  private CreateProcedureResponse createBasePopulatedProcedure(Faker faker, ConcernDto concern) {
    int age = age(faker);
    GenderDto gender = gender(faker);
    CreateProcedureRequest createProcedureRequest =
        new CreateProcedureRequest(
            concern,
            gender,
            yearOfBirth(faker, age),
            appointmentBookingType(),
            appointmentStart(faker, clock),
            durationInMinutes(faker),
            hasSufficientGermanLanguageSkills(faker),
            otherKnownLanguages(faker),
            pronouns(gender));

    return stiProtectionProcedureController.createProcedure(createProcedureRequest);
  }

  private void populateTestExaminations(Faker faker, UUID procedureId) {
    LaboratoryTestExaminationDto testExamination =
        new LaboratoryTestExaminationDto(
            faker.lorem().characters(8),
            faker.lorem().sentence(),
            faker.random().nextBoolean(),
            faker.random().nextBoolean(),
            labTestData(faker));
    examinationController.updateLaboratoryTestExamination(procedureId, testExamination);

    RapidTestExaminationDto rapidTestExamination = getRapidTestExaminationDto(faker);
    examinationController.updateRapidTestExamination(procedureId, rapidTestExamination);
  }

  private void populateDiagnosis(Faker faker, UUID procedureId) {
    Set<TestTypeDto> testTypeDto =
        new HashSet<>(
            BasePopulator.randomElements(faker, Arrays.stream(TestTypeDto.values()).toList()));
    diagnosisController.updateDiagnosis(
        procedureId,
        new DiagnosisDto(
            faker.backToTheFuture().quote(),
            medications(faker),
            null,
            testTypeDto,
            otherTestTypeName(faker, testTypeDto),
            faker.backToTheFuture().quote(),
            faker.bool().bool()));
  }

  private void populateMedicalHistory(Faker faker, UUID procedureId, ConcernDto concern) {
    switch (concern) {
      case HIV_STI_CONSULTATION ->
          medicalHistoryController.updateMedicalHistory(
              procedureId, new CreateMedicalHistoryRequest(stiConsultationMedicalHistory(faker)));
      case SEX_WORK ->
          medicalHistoryController.updateMedicalHistory(
              procedureId, new CreateMedicalHistoryRequest(stiSexWorkMedicalHistory(faker)));
    }
  }

  private SexWorkMedicalHistoryDto stiSexWorkMedicalHistory(Faker faker) {
    Integer numberOfPregnancies = faker.random().nextInt(5);
    return new SexWorkMedicalHistoryDto(
        faker.lorem().sentence(),
        faker.lorem().sentence(),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        BasePopulator.randomElement(faker, RelationshipModelDto.values()),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        !numberOfPregnancies.equals(0),
        numberOfPregnancies,
        numberOfPregnancies.equals(0)
            ? 0
            : numberOfPregnancies - faker.random().nextInt(numberOfPregnancies),
        faker.lorem().sentence(),
        faker.lorem().sentence(),
        examinations(faker),
        previousIllnesses(faker),
        riskContacts(faker),
        new SexWorkRiskContactDto(
            LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
            new HashSet<>(
                BasePopulator.randomElements(
                    faker, Arrays.stream(SexWorkLocationDto.values()).toList()))),
        prevention(faker),
        riskFactors(faker),
        faker.lorem().sentence());
  }

  private StiConsultationMedicalHistoryDto stiConsultationMedicalHistory(Faker faker) {
    return new StiConsultationMedicalHistoryDto(
        faker.lorem().sentence(),
        faker.lorem().sentence(),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        BasePopulator.randomElement(faker, RelationshipModelDto.values()),
        examinations(faker),
        previousIllnesses(faker),
        riskContacts(faker),
        prevention(faker),
        riskFactors(faker),
        faker.lorem().sentence());
  }

  private RiskFactorDto riskFactors(Faker faker) {
    return new RiskFactorDto(
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        faker.lorem().sentence());
  }

  private PreventionDto prevention(Faker faker) {
    return new PreventionDto(
        new HashSet<>(
            BasePopulator.randomElements(faker, Arrays.stream(VaccinationDto.values()).toList())),
        BasePopulator.randomElement(faker, SafeSexPracticeDto.values()),
        new HashSet<>(
            BasePopulator.randomElements(
                faker, Arrays.stream(ProtectionMethodDto.values()).toList())),
        faker.bool().bool());
  }

  private RiskContactDto riskContacts(Faker faker) {
    return new RiskContactDto(
        BasePopulator.randomElement(faker, SexualOrientationDto.values()),
        faker.random().nextInt(20),
        new HashSet<>(
            BasePopulator.randomElements(faker, Arrays.stream(GenderDto.values()).toList())),
        new HashSet<>(
            BasePopulator.randomElements(
                faker, Arrays.stream(PartnerRiskFactorDto.values()).toList())));
  }

  private PreviousIllnessDto previousIllnesses(Faker faker) {
    return new PreviousIllnessDto(
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.residentEvil().biologicalAgent());
  }

  private ExaminationDto examinations(Faker faker) {
    return new ExaminationDto(
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)),
        LocalDate.now(clock).minusMonths(faker.random().nextInt(4)));
  }

  private PregnancySectionDto pregnancy(Faker faker) {
    if (faker.bool().bool())
      return new PregnancySectionDto(false, null, null, null, null, null, null, null);

    Integer numberOfPregnancies = faker.random().nextInt(1, 15);
    Integer numberOfInducedAbortions = faker.random().nextInt(numberOfPregnancies + 1);
    Integer numberOfBirths =
        faker.random().nextInt(numberOfPregnancies - numberOfInducedAbortions + 1);
    Integer numberOfOtherAbortions =
        faker.random().nextInt(numberOfPregnancies - numberOfInducedAbortions - numberOfBirths + 1);
    Integer numberOfEctopicPregnancies =
        numberOfPregnancies - numberOfInducedAbortions - numberOfBirths - numberOfOtherAbortions;

    return new PregnancySectionDto(
        true,
        LocalDate.now(clock).minusDays(faker.random().nextInt(10)),
        LocalDate.now(clock).minusDays(faker.random().nextInt(30)),
        numberOfPregnancies,
        numberOfInducedAbortions,
        numberOfBirths,
        numberOfOtherAbortions,
        numberOfEctopicPregnancies);
  }

  private GeneralSectionDto consultationGeneral(Faker faker) {
    return new GeneralSectionDto(
        faker.videoGame().genre(),
        faker.videoGame().platform(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.videoGame().title(),
        faker.beer().name(),
        faker.lorem().sentence(),
        faker.lorem().sentence());
  }

  private List<MedicationDto> medications(Faker faker) {
    return IntStream.range(0, faker.random().nextInt(0, 3))
        .mapToObj(
            index ->
                new MedicationDto(
                    faker.rickAndMorty().character(),
                    faker.rickAndMorty().quote(),
                    LocalDate.now(clock).minusDays(faker.random().nextInt(10))))
        .toList();
  }

  private String otherTestTypeName(Faker faker, Set<TestTypeDto> testTypes) {
    if (!CollectionUtils.isEmpty(testTypes) && testTypes.contains(TestTypeDto.OTHER))
      return faker.backToTheFuture().character();
    return null;
  }

  private RapidTestExaminationDto getRapidTestExaminationDto(Faker faker) {
    Boolean hivRequested = faker.random().nextBoolean();
    Boolean syphilisRequested = faker.random().nextBoolean();
    Boolean pregnancyTestRequested = faker.random().nextBoolean();
    Boolean ultrasoundRequested = faker.random().nextBoolean();
    Boolean bloodPressureRequested = faker.random().nextBoolean();
    Boolean pulseRequested = faker.random().nextBoolean();
    Boolean urinalysisRequested = faker.random().nextBoolean();

    return new RapidTestExaminationDto(
        faker.lorem().sentence(),
        faker.bool().bool(),
        hivRequested,
        syphilisRequested,
        pregnancyTestRequested,
        ultrasoundRequested,
        bloodPressureRequested,
        pulseRequested,
        urinalysisRequested,
        rapidTestData(faker, hivRequested),
        rapidTestData(faker, syphilisRequested),
        rapidTestData(faker, pregnancyTestRequested),
        faker.boardgame().name(),
        faker.boardgame().name(),
        faker.boardgame().name(),
        faker.boardgame().name());
  }

  private RapidTestDataDto rapidTestData(Faker faker, Boolean requested) {
    if (!requested) return null;
    return new RapidTestDataDto(faker.boardgame().name(), faker.bool().bool());
  }

  private List<LabTestDataDto> labTestData(Faker faker) {
    List<LabTestDataDto> labTestData = new ArrayList<>();

    if (faker.bool().bool()) {
      labTestData.add(
          new CancerScreeningTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new MpoxTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new SyphilisTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.bool().bool()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new HpvTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new OtherTestsDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.lordOfTheRings().character()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new HivTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new MycoplasmaTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.bool().bool(),
              faker.bool().bool(),
              faker.bool().bool()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new GonorrheaTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.bool().bool(),
              faker.bool().bool(),
              faker.bool().bool()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new ChlamydiaTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.bool().bool(),
              faker.bool().bool(),
              faker.bool().bool()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new HepatitisATestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.bool().bool(),
              faker.bool().bool()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new HepatitisBTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes(),
              faker.bool().bool(),
              faker.bool().bool()));
    }
    if (faker.bool().bool()) {
      labTestData.add(
          new HepatitisCTestDto(
              faker.bool().bool(),
              faker.bojackHorseman().characters(),
              faker.bojackHorseman().quotes()));
    }
    return labTestData;
  }

  private static String pronouns(GenderDto gender) {
    return switch (gender) {
      case NOT_SPECIFIED -> null;
      case DIVERSE -> "we/they";
      case FEMALE -> "she/her";
      case MALE -> "he/his";
    };
  }

  private static Boolean hasSufficientGermanLanguageSkills(Faker faker) {
    return faker.random().nextBoolean();
  }

  private static String otherKnownLanguages(Faker faker) {
    return faker.country().countryCode2();
  }

  @Override
  protected long countExistingEntities() {
    return stiProtectionProcedureRepository.count();
  }

  private static ConcernDto concern(Faker faker) {
    return BasePopulator.randomElement(faker, ConcernDto.values());
  }

  private static GenderDto gender(Faker faker) {
    return BasePopulator.randomElement(faker, GenderDto.values());
  }

  private static WaitingStatusDto waitingStatus(Faker faker) {
    return BasePopulator.randomElement(faker, WaitingStatusDto.values());
  }

  private static int age(Faker faker) {
    return faker.random().nextInt(16, 50);
  }

  private Year yearOfBirth(Faker faker, int age) {
    return Year.of(
        LocalDate.now(clock).minusYears(age).minusDays(faker.random().nextInt(182)).getYear());
  }

  private static AppointmentBookingTypeDto appointmentBookingType() {
    return AppointmentBookingTypeDto.USER_DEFINED;
  }

  private static Instant appointmentStart(Faker faker, Clock clock) {
    return clock.instant().plus(faker.random().nextInt(0, 120), ChronoUnit.MINUTES);
  }

  private static Integer durationInMinutes(Faker faker) {
    return faker.random().nextInt(30, 120);
  }
}
