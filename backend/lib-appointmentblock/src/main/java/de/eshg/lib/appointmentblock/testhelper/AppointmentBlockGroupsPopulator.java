/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;
import static de.eshg.lib.appointmentblock.AppointmentBlockValidator.TECHNICAL_GROUP_CONSULTANTS;
import static de.eshg.lib.appointmentblock.AppointmentBlockValidator.TECHNICAL_GROUP_MFAS;
import static de.eshg.lib.appointmentblock.AppointmentBlockValidator.TECHNICAL_GROUP_PHYSICIANS;
import static de.eshg.lib.appointmentblock.AppointmentBlockValidator.TECHNICAL_GROUP_SOPASSS;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.contact.api.*;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.lib.appointmentblock.AppointmentBlockController;
import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.DayOfWeekDtoMapper;
import de.eshg.lib.appointmentblock.api.*;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import de.eshg.testhelper.population.RequestContextFaker;
import java.time.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.util.Assert;

@PopulatorComponent
public class AppointmentBlockGroupsPopulator
    extends BasePopulator<CreateAppointmentBlockGroupResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final AppointmentBlockController appointmentBlockController;
  private final AppointmentBlockGroupRepository appointmentBlockGroupRepository;
  private final AppointmentBlockConfig appointmentBlockConfig;
  private final Optional<TechnicalGroup> groupPhysicians;
  private final Optional<TechnicalGroup> groupMfas;
  private final Optional<TechnicalGroup> groupConsultants;
  private final Optional<TechnicalGroup> groupSopasss;
  private final UserApi userApi;
  private final ContactApi contactApi;
  private final BaseTestHelperApi baseTestHelperApi;

  public AppointmentBlockGroupsPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      AppointmentBlockController appointmentBlockController,
      AppointmentBlockGroupRepository appointmentBlockGroupRepository,
      AppointmentBlockConfig appointmentBlockConfig,
      @Qualifier(TECHNICAL_GROUP_PHYSICIANS) Optional<TechnicalGroup> groupPhysicians,
      @Qualifier(TECHNICAL_GROUP_MFAS) Optional<TechnicalGroup> groupMfas,
      @Qualifier(TECHNICAL_GROUP_CONSULTANTS) Optional<TechnicalGroup> groupConsultants,
      @Qualifier(TECHNICAL_GROUP_SOPASSS) Optional<TechnicalGroup> groupSopasss,
      UserApi userApi,
      ContactApi contactApi,
      BaseTestHelperApi baseTestHelperApi) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(AppointmentBlockGroup.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.appointmentBlockController =
        RequestContextFaker.withFakedRequestContextsIfNecessary(appointmentBlockController);
    this.appointmentBlockGroupRepository = appointmentBlockGroupRepository;
    this.appointmentBlockConfig = appointmentBlockConfig;
    this.groupPhysicians = groupPhysicians;
    this.groupMfas = groupMfas;
    this.groupConsultants = groupConsultants;
    this.groupSopasss = groupSopasss;
    this.userApi = userApi;
    this.contactApi = contactApi;
    this.baseTestHelperApi = baseTestHelperApi;
  }

  @Override
  public ListWithTotalNumber<CreateAppointmentBlockGroupResponse> populate(
      int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected CreateAppointmentBlockGroupResponse populate(
      int index, Faker faker, UniqueValueProvider uniqueValueProvider) {
    List<AppointmentType> appointmentTypes =
        appointmentBlockConfig.getDefaultAppointmentTypeConfiguration().keySet().stream()
            .sorted()
            .toList();

    Assert.notEmpty(appointmentTypes, "No appointment types configured");
    AppointmentType type = randomElement(faker, appointmentTypes);

    int parallelExaminations = faker.random().nextInt(1, 3);
    ZonedDateTime zonedDateTimeStart =
        LocalDate.now(clock)
            .plusDays(faker.random().nextInt(50))
            .atTime(LocalTime.of(7, 0))
            .atZone(clock.getZone())
            .plusMinutes(15L * faker.random().nextInt(20));
    Instant start = zonedDateTimeStart.toInstant();
    DayOfWeekDto dayOfWeek = DayOfWeekDtoMapper.toDto(zonedDateTimeStart.getDayOfWeek());
    Duration appointmentDuration =
        appointmentBlockConfig.getDefaultAppointmentTypeConfiguration().get(type);
    Instant end = start.plus(appointmentDuration.multipliedBy(faker.random().nextInt(1, 5)));

    List<UUID> physicianIds = getRandomUserIdAsList(faker, groupPhysicians);
    List<UUID> mfaIds = getRandomUserIdAsList(faker, groupMfas);
    List<UUID> consultantIds = getRandomUserIdAsList(faker, groupConsultants);
    List<UUID> sopassIds = getRandomUserIdAsList(faker, groupSopasss);
    String room = optional(faker, randomElement(faker, List.of("Raum A", "Raum B", "Raum C")), 0.6);

    UUID locationId =
        switch (appointmentBlockConfig.getLocationSelectionMode()) {
          case NONE -> null;
          case HEALTH_DEPARTMENT ->
              getIdOfFirstContactForCategory(InstitutionContactCategoryDto.HEALTH_DEPARTMENT);
          case SCHOOL -> getIdOfFirstContactForCategory(InstitutionContactCategoryDto.SCHOOL);
        };

    CreateDailyAppointmentBlockGroupRequest request =
        new CreateDailyAppointmentBlockGroupRequest(
            List.of(AppointmentTypeMapper.toInterfaceType(type)),
            parallelExaminations,
            false,
            List.of(new CreateDailyAppointmentBlockDto(start, end, List.of(dayOfWeek))),
            physicianIds,
            mfaIds,
            consultantIds,
            sopassIds,
            room,
            locationId,
            true,
            true);

    return appointmentBlockController.createDailyAppointmentBlocksForGroup(request);
  }

  private List<UUID> getRandomUserIdAsList(Faker faker, Optional<TechnicalGroup> technicalGroup) {
    return technicalGroup.stream()
        .map(group -> userApi.getUsers(new UserFilterParameters(null, group.name())))
        .map(users -> randomElement(faker, users.users()).userId())
        .toList();
  }

  @Override
  protected long countExistingEntities() {
    return this.appointmentBlockGroupRepository.count();
  }

  private UUID getIdOfFirstContactForCategory(InstitutionContactCategoryDto category) {
    return contactApi
        .getContacts(
            new ContactFilterParameters(
                null, null, ContactTypeDto.INSTITUTION, Set.of(category), null, null, null, null))
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
