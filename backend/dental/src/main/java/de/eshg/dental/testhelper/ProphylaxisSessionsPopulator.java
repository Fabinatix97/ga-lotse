/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.ChildController;
import de.eshg.dental.ProphylaxisSessionController;
import de.eshg.dental.api.AbsenceExaminationResultDto;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.CreateProphylaxisSessionResponse;
import de.eshg.dental.api.DentitionTypeDto;
import de.eshg.dental.api.ExaminationResultDto;
import de.eshg.dental.api.FluoridationExaminationResultDto;
import de.eshg.dental.api.FluoridationVarnishDto;
import de.eshg.dental.api.MainResultDto;
import de.eshg.dental.api.MihStatusDto;
import de.eshg.dental.api.OralHygieneStatusDto;
import de.eshg.dental.api.OrthodonticFindingDto;
import de.eshg.dental.api.OrthodonticStatusDto;
import de.eshg.dental.api.ProphylaxisTypeDto;
import de.eshg.dental.api.ReasonForAbsenceDto;
import de.eshg.dental.api.ScreeningExaminationResultDto;
import de.eshg.dental.api.SecondaryResultDto;
import de.eshg.dental.api.ToothDiagnosisDto;
import de.eshg.dental.api.ToothDto;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.persistence.TransactionHelper;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import de.eshg.testhelper.population.RequestContextFaker;
import java.io.Serial;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;
import net.datafaker.Faker;

@PopulatorComponent
public class ProphylaxisSessionsPopulator
    extends DentalPopulator<CreateProphylaxisSessionResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final ProphylaxisSessionController prophylaxisSessionController;
  private final ProphylaxisSessionRepository prophylaxisSessionRepository;
  private final ExaminationRepository examinationRepository;
  private final ChildController childController;
  private final UserApi userApi;
  private final TransactionHelper transactionHelper;
  private final ChildRepository childRepository;

  public ProphylaxisSessionsPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ContactApi contactApi,
      BaseTestHelperApi baseTestHelperApi,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      ProphylaxisSessionController prophylaxisSessionController,
      ProphylaxisSessionRepository prophylaxisSessionRepository,
      @SuppressWarnings("unused") // Used to define a dependency
          ChildrenPopulator childrenPopulator,
      ExaminationRepository examinationRepository,
      ChildController childController,
      UserApi userApi,
      TransactionHelper transactionHelper,
      ChildRepository childRepository) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(Child.class),
        environmentConfig,
        contactApi,
        baseTestHelperApi);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.prophylaxisSessionController =
        RequestContextFaker.withFakedRequestContextsIfNecessary(prophylaxisSessionController);
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
    this.examinationRepository = examinationRepository;
    this.childController = childController;
    this.userApi = userApi;
    this.transactionHelper = transactionHelper;
    this.childRepository = childRepository;
  }

  @Override
  public ListWithTotalNumber<CreateProphylaxisSessionResponse> populate(
      int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected CreateProphylaxisSessionResponse populate(
      int index, Faker faker, UniqueValueProvider uniqueValueProvider) {
    try {
      CreateProphylaxisSessionRequest request = randomProphylaxisSession(faker);
      return prophylaxisSessionController.createProphylaxisSession(request);
    } catch (EmptySchoolException e) {
      log.info("Failed to create ProphylaxisSession:", e);
      return null;
    }
  }

  private CreateProphylaxisSessionRequest randomProphylaxisSession(Faker faker) {
    boolean isPastSession = faker.random().nextBoolean();
    Duration duration =
        Duration.ofDays(faker.random().nextInt(10)).plusHours(faker.random().nextInt(24));
    Instant date = isPastSession ? clock.instant().minus(duration) : clock.instant().plus(duration);
    UUID institutionId = randomSchoolOrDaycare(faker);

    Child randomChild = randomChild(faker, institutionId);
    String groupName = randomChild.getGroupName();
    int year = randomChild.getYear().getValue();

    List<UUID> dentistIds =
        optionalList(
            faker,
            userApi.getUsersByGroup(TechnicalGroup.DENTIST.getKeycloakName()).users().stream()
                .map(UserDto::userId)
                .toList(),
            0.3);
    List<UUID> zfaIds =
        optionalList(
            faker,
            userApi.getUsersByGroup(TechnicalGroup.ZFA.getKeycloakName()).users().stream()
                .map(UserDto::userId)
                .toList(),
            0.3);

    boolean isScreening = faker.random().nextBoolean();
    CreateProphylaxisSessionRequest createProphylaxisSessionRequest =
        new CreateProphylaxisSessionRequest(
            date,
            year,
            institutionId,
            groupName,
            randomProphylaxisType(faker),
            isScreening,
            isScreening ? randomDentitionType(faker) : null,
            randomFluoridationVarnish(faker),
            dentistIds,
            zfaIds);

    transactionHelper.executeInTransaction(() -> randomExaminations(faker));

    return createProphylaxisSessionRequest;
  }

  private Child randomChild(Faker faker, UUID institutionId) {
    List<Child> children =
        childRepository.findByInstitutionIdAndProcedureStatusOrderById(
            institutionId, ProcedureStatus.OPEN);
    if (children.isEmpty()) {
      throw new EmptySchoolException(
          "Populated school %s does not contain any children.".formatted(institutionId));
    }
    return randomElement(faker, children);
  }

  private static ProphylaxisTypeDto randomProphylaxisType(Faker faker) {
    return optional(faker, randomElement(faker, ProphylaxisTypeDto.values()), 0.2);
  }

  private static DentitionTypeDto randomDentitionType(Faker faker) {
    return randomElement(faker, DentitionTypeDto.values());
  }

  private static FluoridationVarnishDto randomFluoridationVarnish(Faker faker) {
    return optional(faker, randomElement(faker, FluoridationVarnishDto.values()));
  }

  private void randomExaminations(Faker faker) {
    List<Examination> someExaminations =
        randomElements(
            faker,
            examinationRepository.findAllByChildStatusWhereResultIsNull(ProcedureStatus.OPEN));

    for (Examination examination : someExaminations) {
      UpdateExaminationRequest request =
          new UpdateExaminationRequest(
              examination.getVersion(),
              faker.coffee().notes(),
              optional(faker, randomResult(faker, examination)));
      childController.updateExamination(examination.getExternalId(), request);
    }
  }

  private static ExaminationResultDto randomResult(Faker faker, Examination examination) {
    ProphylaxisSession prophylaxisSession = examination.getProphylaxisSession();
    boolean isScreening = prophylaxisSession.isScreening();
    boolean hasFluoridationVarnish = prophylaxisSession.hasFluoridationVarnish();

    if (isScreening || hasFluoridationVarnish) {
      if (faker.random().nextDouble() < 0.1) {
        return new AbsenceExaminationResultDto(randomElement(faker, ReasonForAbsenceDto.values()));
      }
    }

    boolean isFluoridationConsentGiven =
        examination.getChild().isFluoridationConsentCurrentlyGiven();

    if (isScreening) {
      return new ScreeningExaminationResultDto(
          optional(
              faker, hasFluoridationVarnish && isFluoridationConsentGiven && faker.bool().bool()),
          optional(faker, randomElement(faker, OralHygieneStatusDto.values())),
          optional(faker, randomElement(faker, MihStatusDto.values())),
          randomOrthodonticFindings(faker),
          optional(faker, randomElement(faker, OrthodonticStatusDto.values())),
          randomDentitionType(faker),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool(),
          randomToothDiagnoses(faker),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool(),
          faker.bool().bool());
    } else if (hasFluoridationVarnish) {
      return new FluoridationExaminationResultDto(
          optional(faker, isFluoridationConsentGiven && faker.bool().bool()));
    } else {
      return null;
    }
  }

  private static List<OrthodonticFindingDto> randomOrthodonticFindings(Faker faker) {
    int count = faker.random().nextInt(10);
    return IntStream.range(0, count)
        .mapToObj(value -> randomElement(faker, OrthodonticFindingDto.values()))
        .toList();
  }

  private static List<ToothDiagnosisDto> randomToothDiagnoses(Faker faker) {
    List<ToothDiagnosisDto> toothDiagnoses = new ArrayList<>();
    boolean milkTeeth = faker.bool().bool();
    List<ToothDto> teeth = milkTeeth ? ToothDto.allMilkTeeth() : ToothDto.allPermanentTeeth();
    for (ToothDto tooth : teeth) {
      MainResultDto mainResult = randomElement(faker, MainResultDto.values());
      if (mainResult == MainResultDto.U && ToothDto.isMolar(tooth)) {
        mainResult = MainResultDto.D;
      }
      SecondaryResultDto secondaryResult =
          optional(faker, randomElement(faker, SecondaryResultDto.values()));
      toothDiagnoses.add(new ToothDiagnosisDto(tooth, mainResult, secondaryResult));
    }
    return toothDiagnoses;
  }

  static class EmptySchoolException extends RuntimeException {
    @Serial private static final long serialVersionUID = 1L;

    public EmptySchoolException(String message) {
      super(message);
    }
  }

  @Override
  protected long countExistingEntities() {
    return prophylaxisSessionRepository.count();
  }
}
