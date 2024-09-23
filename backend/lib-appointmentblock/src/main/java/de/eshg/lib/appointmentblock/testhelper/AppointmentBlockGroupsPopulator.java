/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;
import static de.eshg.lib.appointmentblock.AppointmentBlockService.TECHNICAL_GROUP_CONSULTANTS;
import static de.eshg.lib.appointmentblock.AppointmentBlockService.TECHNICAL_GROUP_MFAS;
import static de.eshg.lib.appointmentblock.AppointmentBlockService.TECHNICAL_GROUP_PHYSICIANS;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserFilterParameters;
import de.eshg.lib.appointmentblock.AppointmentBlockController;
import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockGroupRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import net.datafaker.Faker;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
@ConditionalOnTestHelperEnabled
public class AppointmentBlockGroupsPopulator
    extends BasePopulator<CreateAppointmentBlockGroupResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final AppointmentBlockController appointmentBlockController;
  private final AppointmentBlockGroupRepository appointmentBlockGroupRepository;
  private final AppointmentBlockProperties appointmentBlockProperties;
  private final Optional<TechnicalGroup> groupPhysicians;
  private final Optional<TechnicalGroup> groupMfas;
  private final Optional<TechnicalGroup> groupConsultants;
  private final UserApi userApi;

  public AppointmentBlockGroupsPopulator(
      Clock clock,
      Environment environment,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      AppointmentBlockController appointmentBlockController,
      AppointmentBlockGroupRepository appointmentBlockGroupRepository,
      AppointmentBlockProperties appointmentBlockProperties,
      @Qualifier(TECHNICAL_GROUP_PHYSICIANS) Optional<TechnicalGroup> groupPhysicians,
      @Qualifier(TECHNICAL_GROUP_MFAS) Optional<TechnicalGroup> groupMfas,
      @Qualifier(TECHNICAL_GROUP_CONSULTANTS) Optional<TechnicalGroup> groupConsultants,
      @SuppressWarnings("unused") // Used as dependency
          CreateAppointmentTypeTask createAppointmentTypeTask,
      UserApi userApi) {
    super(clock, environment, getClassNameAsPropertyKey(AppointmentBlockGroup.class));
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.appointmentBlockController = appointmentBlockController;
    this.appointmentBlockGroupRepository = appointmentBlockGroupRepository;
    this.appointmentBlockProperties = appointmentBlockProperties;
    this.groupPhysicians = groupPhysicians;
    this.groupMfas = groupMfas;
    this.groupConsultants = groupConsultants;
    this.userApi = userApi;
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
        appointmentBlockProperties.getDefaultAppointmentTypeConfiguration().keySet().stream()
            .sorted()
            .toList();

    Assert.notEmpty(appointmentTypes, "No appointment types configured");
    AppointmentType type = randomElement(faker, appointmentTypes);

    int parallelExaminations = faker.random().nextInt(1, 3);
    Instant start =
        LocalDate.now(clock)
            .plusDays(faker.random().nextInt(50))
            .atTime(LocalTime.of(7, 0))
            .atZone(clock.getZone())
            .plusMinutes(15L * faker.random().nextInt(20))
            .toInstant();
    Duration appointmentDuration =
        appointmentBlockProperties.getDefaultAppointmentTypeConfiguration().get(type);
    Instant end = start.plus(appointmentDuration.multipliedBy(faker.random().nextInt(1, 5)));

    List<UUID> physicianIds = getRandomUserIdAsList(faker, groupPhysicians);
    List<UUID> mfaIds = getRandomUserIdAsList(faker, groupMfas);
    List<UUID> consultantIds = getRandomUserIdAsList(faker, groupConsultants);

    CreateAppointmentBlockGroupRequest request =
        new CreateAppointmentBlockGroupRequest(
            AppointmentTypeMapper.toInterfaceType(type),
            parallelExaminations,
            start,
            end,
            physicianIds,
            mfaIds,
            consultantIds);

    return appointmentBlockController.createAppointmentBlockGroup(request);
  }

  private List<UUID> getRandomUserIdAsList(Faker faker, Optional<TechnicalGroup> technicalGroup) {
    return technicalGroup.stream()
        .map(group -> userApi.getUsers(new UserFilterParameters(null, group.name())))
        .map(users -> randomElement(faker, users.users()).userId())
        .collect(Collectors.toUnmodifiableList());
  }

  @Override
  protected long countExistingEntities() {
    return this.appointmentBlockGroupRepository.count();
  }
}
