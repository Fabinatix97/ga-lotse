/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.dental.ProphylaxisSessionController;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.CreateProphylaxisSessionResponse;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import de.eshg.testhelper.population.RequestContextFaker;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import net.datafaker.Faker;

@PopulatorComponent
public class ProphylaxisSessionsPopulator
    extends DentalPopulator<CreateProphylaxisSessionResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final ProphylaxisSessionController prophylaxisSessionController;
  private final ProphylaxisSessionRepository prophylaxisSessionRepository;

  public ProphylaxisSessionsPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ContactApi contactApi,
      BaseTestHelperApi baseTestHelperApi,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      ProphylaxisSessionController prophylaxisSessionController,
      ProphylaxisSessionRepository prophylaxisSessionRepository) {
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
    CreateProphylaxisSessionRequest request = randomProphylaxisSession(faker);
    return prophylaxisSessionController.createProphylaxisSession(request);
  }

  private CreateProphylaxisSessionRequest randomProphylaxisSession(Faker faker) {
    boolean isPastSession = faker.random().nextBoolean();
    Duration duration =
        Duration.ofDays(faker.random().nextInt(10)).plusHours(faker.random().nextInt(24));
    Instant date = isPastSession ? clock.instant().minus(duration) : clock.instant().plus(duration);

    return new CreateProphylaxisSessionRequest(date, randomSchool(faker));
  }

  @Override
  protected long countExistingEntities() {
    return prophylaxisSessionRepository.count();
  }
}
