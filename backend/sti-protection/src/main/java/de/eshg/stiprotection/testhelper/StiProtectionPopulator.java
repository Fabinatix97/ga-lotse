/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.stiprotection.StiProtectionProcedureController;
import de.eshg.stiprotection.WaitingRoomController;
import de.eshg.stiprotection.api.AppointmentBookingTypeDto;
import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.CreateProcedureResponse;
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
import net.datafaker.Faker;

@PopulatorComponent
public class StiProtectionPopulator extends BasePopulator<CreateProcedureResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final StiProtectionProcedureController stiProtectionProcedureController;
  private final WaitingRoomController waitingRoomController;
  private final StiProtectionProcedureRepository stiProtectionProcedureRepository;

  public StiProtectionPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      StiProtectionProcedureController stiProtectionProcedureController,
      StiProtectionProcedureRepository stiProtectionProcedureRepository,
      WaitingRoomController waitingRoomController) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(StiProtectionProcedure.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.stiProtectionProcedureController = stiProtectionProcedureController;
    this.waitingRoomController = waitingRoomController;
    this.stiProtectionProcedureRepository = stiProtectionProcedureRepository;
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

    int age = age(faker);
    CreateProcedureRequest createProcedureRequest =
        new CreateProcedureRequest(
            concern(faker),
            gender(faker),
            yearOfBirth(faker, age),
            optional(faker, countryOfBirth(faker), 0.66),
            optional(faker, inGermanySince(faker, age), 0.5),
            appointmentBookingType(),
            appointmentStart(faker, clock),
            durationInMinutes(faker));

    CreateProcedureResponse resp =
        stiProtectionProcedureController.createProcedure(createProcedureRequest);

    // Move into waiting room
    if (faker.bool().bool()) {
      waitingRoomController.updateWaitingRoomDetails(
          resp.procedureId(),
          new WaitingRoomDto(faker.simpsons().location(), waitingStatus(faker)));
    }

    return resp;
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

  private Year inGermanySince(Faker faker, int age) {
    return Year.of(LocalDate.now(clock).minusYears(faker.random().nextInt(age)).getYear());
  }

  private static CountryCode countryOfBirth(Faker faker) {
    return BasePopulator.randomElement(faker, CountryCode.values());
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
