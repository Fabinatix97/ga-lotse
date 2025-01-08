/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.dental.ChildController;
import de.eshg.dental.ProphylaxisSessionController;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.CreateProphylaxisSessionResponse;
import de.eshg.dental.api.ProphylaxisTypeDto;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
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
import java.util.List;
import java.util.UUID;
import net.datafaker.Faker;

@PopulatorComponent
public class ProphylaxisSessionsPopulator
    extends DentalPopulator<CreateProphylaxisSessionResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final ProphylaxisSessionController prophylaxisSessionController;
  private final ProphylaxisSessionRepository prophylaxisSessionRepository;
  private final ExaminationRepository examinationRepository;
  private final ChildController childController;

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
      ChildController childController) {
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
    String groupName = randomGroupAtInstitution(faker, institutionId);

    CreateProphylaxisSessionRequest createProphylaxisSessionRequest =
        new CreateProphylaxisSessionRequest(
            date, institutionId, groupName, randomProphylaxisType(faker));

    randomExaminations(faker);

    return createProphylaxisSessionRequest;
  }

  private String randomGroupAtInstitution(Faker faker, UUID institutionId) {
    List<String> existingGroups = childController.getInstitutionGroups(institutionId).groups();
    if (existingGroups.isEmpty()) {
      throw new EmptySchoolException(
          "Populated school %s does not contain any groups.".formatted(institutionId));
    }
    return randomElement(faker, existingGroups);
  }

  private static ProphylaxisTypeDto randomProphylaxisType(Faker faker) {
    return randomElement(faker, ProphylaxisTypeDto.values());
  }

  private void randomExaminations(Faker faker) {
    List<Examination> someExaminations =
        randomElements(faker, examinationRepository.findAllByChildStatus(ProcedureStatus.OPEN));

    for (Examination examination : someExaminations) {
      UpdateExaminationRequest request =
          new UpdateExaminationRequest(examination.getVersion(), faker.coffee().notes());
      childController.updateExamination(examination.getExternalId(), request);
    }
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
