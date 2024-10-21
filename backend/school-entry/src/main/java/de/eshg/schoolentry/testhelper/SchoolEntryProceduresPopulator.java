/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.contact.api.*;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.lib.appointmentblock.testhelper.AppointmentBlockGroupsPopulator;
import de.eshg.lib.common.CountryCode;
import de.eshg.schoolentry.LabelController;
import de.eshg.schoolentry.SchoolEntryController;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.anamnesis.*;
import de.eshg.schoolentry.config.SchoolEntryFeatureToggle;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.RequestContextFaker;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Stream;
import net.datafaker.Faker;
import net.datafaker.providers.base.Address;
import net.datafaker.providers.base.Name;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class SchoolEntryProceduresPopulator extends BasePopulator<CreateProcedureResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final SchoolEntryController schoolEntryController;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final LabelController labelController;
  private final BaseTestHelperApi baseTestHelperApi;
  private final SchoolEntryFeatureToggle featureToggle;
  private final ContactApi contactApi;
  private final AppointmentBlockProperties appointmentBlockProperties;

  public SchoolEntryProceduresPopulator(
      Clock clock,
      Environment environment,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      SchoolEntryController schoolEntryController,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      LabelController labelController,
      BaseTestHelperApi baseTestHelperApi,
      SchoolEntryFeatureToggle featureToggle,
      @SuppressWarnings("unused") // Used to define a dependency
          AppointmentBlockGroupsPopulator appointmentBlockGroupsPopulator,
      EnvironmentConfig environmentConfig,
      ContactApi contactApi,
      AppointmentBlockProperties appointmentBlockProperties) {
    super(
        clock,
        environment,
        getClassNameAsPropertyKey(SchoolEntryProcedure.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.schoolEntryController =
        RequestContextFaker.withFakedRequestContextsIfNecessary(schoolEntryController);
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.labelController = labelController;
    this.baseTestHelperApi = baseTestHelperApi;
    this.featureToggle = featureToggle;
    this.contactApi = contactApi;
    this.appointmentBlockProperties = appointmentBlockProperties;
  }

  @Override
  public ListWithTotalNumber<CreateProcedureResponse> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          ListWithTotalNumber<CreateProcedureResponse> response =
              populateWithAuthentication(numberOfEntitiesToPopulate);
          UUID schoolId = getIdOfFirstContactForCategory(InstitutionContactCategoryDto.SCHOOL);
          assignSchool(response.entities().subList(0, numberOfEntitiesToPopulate / 2), schoolId);
          if (appointmentBlockProperties.getLocationSelectionMode()
              == LocationSelectionMode.HEALTH_DEPARTMENT) {
            assignLocationId(
                response.entities().subList(0, numberOfEntitiesToPopulate / 2),
                getIdOfFirstContactForCategory(InstitutionContactCategoryDto.HEALTH_DEPARTMENT));
          }
          assignSpecialNeedsLabel(response.entities().subList(0, numberOfEntitiesToPopulate / 5));
          createAppointments(response.entities());
          return response;
        });
  }

  private void createAppointments(List<CreateProcedureResponse> procedures) {
    schoolEntryController.createAppointmentsInBulk(
        new CreateAppointmentsBulkRequest(
            procedures.stream().map(CreateProcedureResponse::procedureId).toList()));
  }

  private void assignSpecialNeedsLabel(List<CreateProcedureResponse> procedures) {
    UUID labelId = labelController.getLabels().labels().getFirst().id();
    for (CreateProcedureResponse procedure : procedures) {
      ProcedureDetailsDto procedureToUpdate =
          schoolEntryController.getProcedure(procedure.procedureId());
      schoolEntryController.updateProcedure(
          procedure.procedureId(),
          new UpdateProcedureRequest(
              procedureToUpdate.version(),
              procedureToUpdate.type(),
              List.of(labelId),
              procedureToUpdate.appointment(),
              procedureToUpdate.isInvitationSent(),
              getSchoolId(procedureToUpdate),
              getLocationId(procedureToUpdate),
              procedureToUpdate.isDeceased(),
              procedureToUpdate.deceased(),
              procedureToUpdate.schoolYear()));
    }
  }

  private static @Nullable UUID getSchoolId(ProcedureDetailsDto procedureDetails) {
    return procedureDetails.school() != null ? procedureDetails.school().id() : null;
  }

  private static UUID getLocationId(ProcedureDetailsDto procedureDetails) {
    return procedureDetails.location() != null ? procedureDetails.location().id() : null;
  }

  private void assignSchool(List<CreateProcedureResponse> procedures, UUID schoolId) {
    for (CreateProcedureResponse procedure : procedures) {
      ProcedureDetailsDto procedureToUpdate =
          schoolEntryController.getProcedure(procedure.procedureId());
      schoolEntryController.updateProcedure(
          procedure.procedureId(),
          new UpdateProcedureRequest(
              procedureToUpdate.version(),
              procedureToUpdate.type(),
              procedureToUpdate.labels().stream().map(LabelDto::id).toList(),
              procedureToUpdate.appointment(),
              procedureToUpdate.isInvitationSent(),
              schoolId,
              getLocationId(procedureToUpdate),
              procedureToUpdate.isDeceased(),
              procedureToUpdate.deceased(),
              procedureToUpdate.schoolYear()));
    }
  }

  private void assignLocationId(List<CreateProcedureResponse> procedures, UUID locationId) {
    for (CreateProcedureResponse procedure : procedures) {
      ProcedureDetailsDto procedureToUpdate =
          schoolEntryController.getProcedure(procedure.procedureId());
      schoolEntryController.updateProcedure(
          procedure.procedureId(),
          new UpdateProcedureRequest(
              procedureToUpdate.version(),
              procedureToUpdate.type(),
              procedureToUpdate.labels().stream().map(LabelDto::id).toList(),
              procedureToUpdate.appointment(),
              procedureToUpdate.isInvitationSent(),
              procedureToUpdate.school().id(),
              locationId,
              procedureToUpdate.isDeceased(),
              procedureToUpdate.deceased(),
              procedureToUpdate.schoolYear()));
    }
  }

  @Override
  protected CreateProcedureResponse populate(
      int index,
      Faker faker,
      SchoolEntryProceduresPopulator.UniqueValueProvider uniqueValueProvider) {
    CreatePersonDto child = randomPerson(faker);
    CreateProcedureRequest request =
        new CreateProcedureRequest(child, randomElement(faker, ProcedureTypeDto.values()));
    CreateProcedureResponse response = schoolEntryController.createProcedure(request);
    createRandomExaminationsAndAnamnesisForProcedure(response.procedureId(), faker);
    setRandomSchoolYear(response.procedureId(), faker);
    return response;
  }

  private CreatePersonDto randomPerson(Faker faker) {
    Name name = faker.name();
    LocalDate dateOfBirth =
        LocalDate.now(clock).minusYears(5).minusDays(faker.random().nextInt(400));

    return new CreatePersonDto(
        null,
        name.title(),
        optional(faker, randomElement(faker, SalutationDto.values()), 0.9),
        optional(faker, randomElement(faker, GenderDto.values()), 0.05),
        name.firstName(),
        name.lastName(),
        dateOfBirth,
        optional(faker, faker.name().lastName(), 0.95),
        optional(faker, faker.address().city(), 0.5),
        randomCountryBase(faker),
        optional(faker, randomListOfEmails(faker, 1), 0.4),
        optional(faker, randomListOfPhoneNumbers(faker, 1), 0.4),
        optional(faker, randomAddress(faker), 0.3),
        null);
  }

  private static DomesticAddressDto randomAddress(Faker faker) {
    Address address = faker.address();
    return new DomesticAddressDto(
        randomCountryBase(faker),
        address.city(),
        address.postcode(),
        null,
        address.streetAddress(),
        optional(faker, address.streetAddressNumber(), 0.1),
        optional(faker, address.secondaryAddress(), 0.1));
  }

  private static CountryCode randomCountryBase(Faker faker) {
    return randomElement(faker, CountryCode.values());
  }

  private void createRandomExaminationsAndAnamnesisForProcedure(UUID procedureId, Faker faker) {
    HearingTestResultDto hearingTestResult = optional(faker, randomHearingTest(faker), 0.5);
    if (hearingTestResult != null) {
      schoolEntryController.updateHearingTestResult(procedureId, hearingTestResult);
    }
    EyeExaminationResultDto eyeExaminationResultDto =
        optional(faker, randomEyeExamination(faker), 0.5);
    if (eyeExaminationResultDto != null) {
      schoolEntryController.updateEyeExaminationResult(procedureId, eyeExaminationResultDto);
    }
    SopessExaminationResultDto sopessExaminationResultDto =
        optional(faker, randomSopessExamination(faker), 0.5);
    if (sopessExaminationResultDto != null) {
      schoolEntryController.updateSopessExaminationResult(procedureId, sopessExaminationResultDto);
    }
    AnamnesisDto anamnesisDto = optional(faker, randomAnamnesis(faker), 0.5);
    if (anamnesisDto != null) {
      schoolEntryController.updateAnamnesis(procedureId, anamnesisDto);
    }
    DevelopmentScreeningResultDto developmentScreeningResultDto =
        optional(faker, randomDevelopmentScreeningResult(faker), 0.5);
    if (developmentScreeningResultDto != null) {
      schoolEntryController.updateDevelopmentScreeningResult(
          procedureId, developmentScreeningResultDto);
    }
    VaccinationStatusDto vaccinationStatusDto =
        optional(faker, randomVaccinationStatus(faker), 0.5);
    if (vaccinationStatusDto != null) {
      schoolEntryController.updateVaccinationStatus(procedureId, vaccinationStatusDto);
    }
  }

  private void setRandomSchoolYear(@NotNull UUID procedureId, Faker faker) {
    ProcedureDetailsDto procedureToUpdate = schoolEntryController.getProcedure(procedureId);
    int currentYear = Year.now(clock).getValue();
    schoolEntryController.updateProcedure(
        procedureId,
        new UpdateProcedureRequest(
            procedureToUpdate.version(),
            procedureToUpdate.type(),
            procedureToUpdate.labels().stream().map(LabelDto::id).toList(),
            procedureToUpdate.appointment(),
            procedureToUpdate.isInvitationSent(),
            getSchoolId(procedureToUpdate),
            getLocationId(procedureToUpdate),
            procedureToUpdate.isDeceased(),
            procedureToUpdate.deceased(),
            faker.number().numberBetween(currentYear - 5, currentYear + 5)));
  }

  /* hearing test */

  private static HearingTestResultDto randomHearingTest(Faker faker) {
    Map<HertzValueDto, DecibelValueDto> leftEar = randomHertzDecibelMapping(faker);
    Map<HertzValueDto, DecibelValueDto> rightEar = randomHertzDecibelMapping(faker);
    return new HearingTestResultDto(
        0L, leftEar, rightEar, randomExaminationResult(faker), faker.coffee().notes());
  }

  private static Map<HertzValueDto, DecibelValueDto> randomHertzDecibelMapping(Faker faker) {
    Map<HertzValueDto, DecibelValueDto> ear = new LinkedHashMap<>();
    for (HertzValueDto hertzValueDto : HertzValueDto.values()) {
      ear.put(hertzValueDto, optional(faker, randomElement(faker, DecibelValueDto.values()), 0.1));
    }
    return ear;
  }

  private static ExaminationResultDto randomExaminationResult(Faker faker) {
    ExaminationResultValueDto examinationResultValue =
        randomElement(faker, ExaminationResultValueDto.values());
    return new ExaminationResultDto(
        examinationResultValue,
        examinationResultValue == ExaminationResultValueDto.DOCTOR_LETTER
            ? randomDoctorLetterValue(faker)
            : null);
  }

  private static DoctorLetterValueDto randomDoctorLetterValue(Faker faker) {
    return randomElement(faker, DoctorLetterValueDto.values());
  }

  /* eye examination */

  private static EyeExaminationResultDto randomEyeExamination(Faker faker) {
    ExaminationResultDto eyeExamination = randomExaminationResult(faker);
    DoctorLetterValueDto doctorLetterValueDto = eyeExamination.doctorLetterValue();
    return new EyeExaminationResultDto(
        0L,
        randomEyePercentageMapping(faker),
        randomEyePercentageMapping(faker),
        eyeExamination,
        randomExaminationResult(faker),
        randomExaminationResult(faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        resolveDoctorLetterValue(doctorLetterValueDto, faker),
        faker.coffee().notes());
  }

  private static boolean resolveDoctorLetterValue(
      DoctorLetterValueDto doctorLetterValueDto, Faker faker) {
    return doctorLetterValueDto != null
        && (doctorLetterValueDto.equals(DoctorLetterValueDto.CONFIRMED)
            || doctorLetterValueDto.equals(DoctorLetterValueDto.PARTIALLY_CONFIRMED))
        && faker.bool().bool();
  }

  private static Map<EyeExaminationTypeDto, PercentageValueDto> randomEyePercentageMapping(
      Faker faker) {
    Map<EyeExaminationTypeDto, PercentageValueDto> eye = new LinkedHashMap<>();
    for (EyeExaminationTypeDto eyeExaminationTypeDto : EyeExaminationTypeDto.values()) {
      eye.put(
          eyeExaminationTypeDto,
          optional(faker, randomElement(faker, PercentageValueDto.values()), 0.1));
    }
    return eye;
  }

  /* sopess examination */

  private static SopessExaminationResultDto randomSopessExamination(Faker faker) {
    SopessExaminationResultDto sopessExaminationResultDto = new SopessExaminationResultDto();
    sopessExaminationResultDto.setVersion(0);
    sopessExaminationResultDto.setGrossMotorSkills(randomScoredEvaluationExaminationDto(faker));
    sopessExaminationResultDto.setFineMotorSkills(randomScoredEvaluationExaminationDto(faker));
    sopessExaminationResultDto.setHandedness(randomElement(faker, HandednessValueDto.values()));
    sopessExaminationResultDto.setVisualPerceptionResult(
        randomScoredEvaluationExaminationDto(faker));
    sopessExaminationResultDto.setLanguage(randomLanguageDto(faker));
    sopessExaminationResultDto.setArticulation(randomArticulationDto(faker));
    sopessExaminationResultDto.setSpeechResult(randomSpeechEvaluationExaminationDto(faker));
    sopessExaminationResultDto.setAuditiveProcessingResult(
        randomScoredEvaluationExaminationDto(faker));
    sopessExaminationResultDto.setKnowledgeThinkingResult(
        randomKnowledgeThinkingExaminationDto(faker));
    sopessExaminationResultDto.setPsychologicalBehaviorResult(
        randomScoredEvaluationExaminationDto(faker));
    return sopessExaminationResultDto;
  }

  private static ScoredEvaluationExaminationDto randomScoredEvaluationExaminationDto(Faker faker) {
    return new ScoredEvaluationExaminationDto(
        faker.random().nextInt(0, 6), randomEvaluationExaminationDto(faker));
  }

  private static EvaluationExaminationDto randomEvaluationExaminationDto(Faker faker) {
    SopessExaminationResultValueDto examinationResultValue =
        randomElement(faker, SopessExaminationResultValueDto.values());
    return new EvaluationExaminationDto(
        examinationResultValue,
        examinationResultValue == SopessExaminationResultValueDto.DOCTOR_LETTER
            ? randomDoctorLetterValue(faker)
            : null);
  }

  private static LanguageDto randomLanguageDto(Faker faker) {
    return new LanguageDto(
        randomElement(faker, PrimaryLanguageValueDto.values()),
        randomElement(faker, LanguageKnowledgeValueDto.values()),
        randomElement(faker, FamilyLanguageValueDto.values()),
        randomElement(faker, GermanKnowledgeValueDto.values()));
  }

  private static ArticulationDto randomArticulationDto(Faker faker) {
    return new ArticulationDto(
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker),
        randomArticulationValueDto(faker));
  }

  private static ArticulationValueDto randomArticulationValueDto(Faker faker) {
    return randomElement(faker, ArticulationValueDto.values());
  }

  private static SpeechEvaluationExaminationDto randomSpeechEvaluationExaminationDto(Faker faker) {
    return new SpeechEvaluationExaminationDto(
        faker.random().nextInt(0, 8),
        faker.random().nextInt(0, 7),
        randomEvaluationExaminationDto(faker));
  }

  private static KnowledgeThinkingExaminationDto randomKnowledgeThinkingExaminationDto(
      Faker faker) {
    return new KnowledgeThinkingExaminationDto(
        faker.random().nextInt(0, 20),
        faker.random().nextInt(0, 16),
        randomEvaluationExaminationDto(faker));
  }

  private DevelopmentScreeningResultDto randomDevelopmentScreeningResult(Faker faker) {
    return new DevelopmentScreeningResultDto(
        0L,
        randomMeasurementsDto(faker),
        randomPhysicalExaminationDto(faker),
        randomHandicapDto(faker),
        randomPsychoSocialRiskDto(faker),
        randomSocioEducationalPerformanceDto(faker),
        faker.bool().bool(),
        randomElement(faker, SchoolRecommendationDto.values()),
        randomElement(faker, SchoolFeedbackDto.values()));
  }

  private static MeasurementsDto randomMeasurementsDto(Faker faker) {
    return new MeasurementsDto(
        faker.random().nextInt(1050, 1200) / 1000.0,
        faker.number().randomDouble(3, 20, 40),
        faker.random().nextInt(90, 140),
        faker.random().nextInt(50, 90));
  }

  private PhysicalExaminationDto randomPhysicalExaminationDto(Faker faker) {
    List<String> icd10Codes = fetchSomeIcd10Codes();

    return new PhysicalExaminationDto(
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        randomExaminationWithDiagnosisDto(faker, icd10Codes),
        faker.coffee().notes());
  }

  private List<String> fetchSomeIcd10Codes() {
    return Stream.of("a", "b", "c")
        .flatMap(
            searchString -> {
              SearchIcd10CodesResponse searchResponse =
                  schoolEntryController.searchIcd10Codes(searchString, List.of());
              return searchResponse.codes().stream();
            })
        .map(Icd10CodeDto::code)
        .distinct()
        .sorted()
        .toList();
  }

  private static ExaminationWithDiagnosisDto randomExaminationWithDiagnosisDto(
      Faker faker, List<String> icd10Codes) {
    ExaminationResultDto examinationResult = randomExaminationResult(faker);
    List<String> codes =
        (examinationResult.examinationResultValue() == ExaminationResultValueDto.OK
                || examinationResult.examinationResultValue() == ExaminationResultValueDto.UNKNOWN)
            ? List.of()
            : randomSubset(faker, icd10Codes);
    return new ExaminationWithDiagnosisDto(examinationResult, codes);
  }

  private static List<String> randomSubset(Faker faker, List<String> icd10Codes) {
    List<String> list = new ArrayList<>(icd10Codes);
    Collections.shuffle(list, faker.random().getRandomInternal());
    return list.stream().limit(faker.random().nextInt(0, 4)).toList();
  }

  private static HandicapDto randomHandicapDto(Faker faker) {
    HandicapWithDiagnosisDto disability = randomHandicapWithDiagnosisDto(faker);
    return new HandicapDto(
        randomHandicapWithDiagnosisDto(faker),
        disability,
        randomDisabilityTypeDto(faker, disability),
        faker.coffee().notes());
  }

  private static HandicapWithDiagnosisDto randomHandicapWithDiagnosisDto(Faker faker) {
    return new HandicapWithDiagnosisDto(faker.bool().bool(), List.of());
  }

  private static DisabilityTypeDto randomDisabilityTypeDto(
      Faker faker, HandicapWithDiagnosisDto disability) {
    return Boolean.TRUE.equals(disability.result())
        ? randomElement(faker, DisabilityTypeDto.values())
        : null;
  }

  private static PsychoSocialRiskDto randomPsychoSocialRiskDto(Faker faker) {
    return new PsychoSocialRiskDto(
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool());
  }

  private static SocioEducationalPerformanceDto randomSocioEducationalPerformanceDto(Faker faker) {
    return new SocioEducationalPerformanceDto(
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool());
  }

  /* anamnesis */

  private static AnamnesisDto randomAnamnesis(Faker faker) {
    return new AnamnesisDto(
        0L,
        faker.bool().bool(),
        faker.bool().bool(),
        randomCheckUpsDto(faker),
        randomPromotionBeforeSchoolEntryDto(faker),
        randomMigrationBackgroundDto(faker),
        new AdditionalChildInfoDto(),
        new DaycareAndSchoolInfoDto(),
        new FamilyHistoryInfoDto(),
        new DevelopmentInfoDto(),
        new IllnessAndAccidentInfoDto(),
        new PromotionTherapyAndAidInfoDto(),
        new InterestsAndSportsInfoDto(),
        null);
  }

  private static CheckUpsDto randomCheckUpsDto(Faker faker) {
    return new CheckUpsDto(
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker),
        randomBooleanWithUnknownSchoolEntry(faker));
  }

  private static PromotionBeforeSchoolEntryDto randomPromotionBeforeSchoolEntryDto(Faker faker) {
    return new PromotionBeforeSchoolEntryDto(
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool(),
        faker.bool().bool());
  }

  private static MigrationBackgroundDto randomMigrationBackgroundDto(Faker faker) {
    LocalDate inGermanySince =
        LocalDate.now().minusYears(10).minusDays(faker.random().nextInt(400));
    return new MigrationBackgroundDto(
        randomCountrySchoolEntry(faker),
        randomCountrySchoolEntry(faker),
        randomCountrySchoolEntry(faker),
        randomCountrySchoolEntry(faker),
        randomCountrySchoolEntry(faker),
        randomCountrySchoolEntry(faker),
        faker.bool().bool(),
        inGermanySince);
  }

  private static de.eshg.schoolentry.api.CountryCodeDto randomCountrySchoolEntry(Faker faker) {
    return randomElement(faker, de.eshg.schoolentry.api.CountryCodeDto.values());
  }

  /* vaccination status */

  private static VaccinationStatusDto randomVaccinationStatus(Faker faker) {
    return new VaccinationStatusDto(
        0L,
        randomVaccinationSchemeSchoolEntry(faker),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        faker.random().nextInt(0, 9),
        List.of(),
        faker.bool().bool(),
        randomBooleanWithUnknownSchoolEntry(faker),
        faker.bool().bool(),
        faker.bool().bool(),
        null);
  }

  private static VaccinationSchemeValueDto randomVaccinationSchemeSchoolEntry(Faker faker) {
    return randomElement(faker, VaccinationSchemeValueDto.values());
  }

  private static BooleanWithUnknownDto randomBooleanWithUnknownSchoolEntry(Faker faker) {
    return randomElement(faker, BooleanWithUnknownDto.values());
  }

  @Override
  protected long countExistingEntities() {
    return this.schoolEntryProcedureRepository.count();
  }

  private UUID getIdOfFirstContactForCategory(InstitutionContactCategoryDto category) {
    return contactApi
        .getContacts(
            new ContactFilterParameters(
                null, null, ContactTypeDto.INSTITUTION, category, null, null, null, null))
        .elements()
        .stream()
        .findFirst()
        .map(ContactDto::id)
        .orElseGet(() -> populateOneContactOfCategoryAndGetId(category));
  }

  private UUID populateOneContactOfCategoryAndGetId(InstitutionContactCategoryDto category) {
    SearchContactsResponse response =
        switch (category) {
          case SCHOOL -> baseTestHelperApi.populateSchoolContacts(new PopulationRequest(1));
          case HEALTH_DEPARTMENT ->
              baseTestHelperApi.populateHealthDepartmentContacts(new PopulationRequest(1));
          case null, default ->
              throw new IllegalStateException(
                  "Expected only to be used with SCHOOL or HEALTH_DEPARTMENT. Got: " + category);
        };
    return response.elements().getFirst().id();
  }
}
