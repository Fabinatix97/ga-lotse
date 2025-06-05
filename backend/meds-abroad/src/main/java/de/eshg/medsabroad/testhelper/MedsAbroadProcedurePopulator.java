/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.medsabroad.MedsAbroadController;
import de.eshg.medsabroad.api.CreateMedsAbroadProcedureRequest;
import de.eshg.medsabroad.api.CreateMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.CreatePersonDto;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedureRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import java.time.LocalDate;
import net.datafaker.Faker;

@PopulatorComponent
public class MedsAbroadProcedurePopulator extends BasePopulator<CreateMedsAbroadProcedureResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final MedsAbroadController medsAbroadController;
  private final MedsAbroadProcedureRepository medsAbroadProcedureRepository;

  public MedsAbroadProcedurePopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      MedsAbroadController medsAbroadController,
      MedsAbroadProcedureRepository medsAbroadProcedureRepository) {
    super(
        properties, clock, getClassNameAsPropertyKey(MedsAbroadProcedure.class), environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.medsAbroadController = medsAbroadController;
    this.medsAbroadProcedureRepository = medsAbroadProcedureRepository;
  }

  @Override
  public ListWithTotalNumber<CreateMedsAbroadProcedureResponse> populate(
      int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected CreateMedsAbroadProcedureResponse populate(
      int index,
      Faker faker,
      BasePopulator<CreateMedsAbroadProcedureResponse>.UniqueValueProvider uniqueValueProvider) {
    return createMedsAbroadProcedure(faker);
  }

  @Override
  protected long countExistingEntities() {
    return medsAbroadProcedureRepository.count();
  }

  private CreateMedsAbroadProcedureResponse createMedsAbroadProcedure(Faker faker) {
    CreateMedsAbroadProcedureRequest request =
        new CreateMedsAbroadProcedureRequest(createPerson(faker), null, null);
    return medsAbroadController.createMedsAbroadProcedure(request);
  }

  private CreatePersonDto createPerson(Faker faker) {
    int age = faker.random().nextInt(19, 67);
    LocalDate birthDate =
        LocalDate.now(clock).minusYears(age).minusDays(faker.random().nextInt(400));
    return new CreatePersonDto(faker.name().firstName(), faker.name().lastName(), birthDate);
  }
}
