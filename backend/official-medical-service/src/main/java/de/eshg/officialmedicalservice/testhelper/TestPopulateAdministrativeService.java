/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.DayOfWeekDto;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateAdministrativeResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@ConditionalOnTestHelperEnabled
@Service
public class TestPopulateAdministrativeService {

  public static final String OMS_NOW_KEY = "Amtsärtzlicher Dienst_heute_09_Uhr";
  public static final String OMS_PHYSICIANS = "Amtsärtzlicher Dienst_Ärzte";

  private final AppointmentBlockService appointmentBlockService;
  private final UserApi userApiClient;
  private final Clock clock;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;

  public TestPopulateAdministrativeService(
      AppointmentBlockService appointmentBlockService,
      UserApi userApiClient,
      Clock clock,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper) {
    this.appointmentBlockService = appointmentBlockService;
    this.userApiClient = userApiClient;
    this.clock = clock;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
  }

  @Transactional
  public PostPopulateAdministrativeResponse populateAdministrative() {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          Map<String, List<UUID>> physicians = getPhysicians();
          Map<String, UUID> appointmentBlockGroups = createAppointmentBlockGroups(physicians);

          return new PostPopulateAdministrativeResponse(appointmentBlockGroups, physicians);
        });
  }

  private Map<String, List<UUID>> getPhysicians() {
    List<UUID> physicians =
        userApiClient
            .getUsersByGroup(TechnicalGroup.OFFICIAL_MEDICAL_SERVICE_PHYSICIANS.getKeycloakName())
            .users()
            .stream()
            .map(UserDto::userId)
            .toList();

    Map<String, List<UUID>> physiciansGroup = new LinkedHashMap<>();
    physiciansGroup.put(OMS_PHYSICIANS, physicians);
    return physiciansGroup;
  }

  private Map<String, UUID> createAppointmentBlockGroups(Map<String, List<UUID>> physicians) {
    UUID physician = physicians.get(OMS_PHYSICIANS).getFirst();

    Instant startBlock_omsNow =
        ZonedDateTime.now(clock)
            .truncatedTo(ChronoUnit.DAYS)
            .plusWeeks(3)
            .plusHours(9L)
            .toInstant();

    //    9th March to test months change in appointment picker
    Instant endBlock_omsNow = startBlock_omsNow.plus(Duration.ofDays(18).plusHours(3L));

    UUID appointmentBlockGroup_omsNow =
        appointmentBlockService
            .createDailyAppointmentBlocksForGroup(
                new CreateDailyAppointmentBlockGroupRequest(
                    AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE,
                    2,
                    List.of(
                        new CreateDailyAppointmentBlockDto(
                            startBlock_omsNow,
                            endBlock_omsNow,
                            List.of(
                                DayOfWeekDto.MONDAY,
                                DayOfWeekDto.TUESDAY,
                                DayOfWeekDto.WEDNESDAY))),
                    List.of(physician),
                    List.of(),
                    List.of()))
            .id();

    Map<String, UUID> appointmentBlockGroups = new LinkedHashMap<>();
    appointmentBlockGroups.put(OMS_NOW_KEY, appointmentBlockGroup_omsNow);
    return appointmentBlockGroups;
  }
}
