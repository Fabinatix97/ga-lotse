/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import de.eshg.base.user.api.UserDto;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.DayOfWeekDto;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateAdministrativeResponse;
import de.eshg.officialmedicalservice.user.UserClient;
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
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@ConditionalOnTestHelperEnabled
@Service
public class TestPopulateAdministrativeService {

  public static final String OMS_NOW_SHORT_KEY = "Amtsärztlicher Dienst_heute_kurz_09_Uhr";
  public static final String OMS_NOW_LONG_KEY = "Amtsärztlicher Dienst_heute_lang_09_Uhr";

  private final AppointmentBlockService appointmentBlockService;
  private final Clock clock;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final UserClient userClient;

  public TestPopulateAdministrativeService(
      AppointmentBlockService appointmentBlockService,
      UserClient userClient,
      Clock clock,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper) {
    this.appointmentBlockService = appointmentBlockService;
    this.userClient = userClient;
    this.clock = clock;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
  }

  @Transactional
  public PostPopulateAdministrativeResponse populateAdministrative() {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          Map<String, UUID> physicians = createPhysicians();
          Map<String, UUID> appointmentBlockGroups = createAppointmentBlockGroups(physicians);

          return new PostPopulateAdministrativeResponse(appointmentBlockGroups, physicians);
        });
  }

  private Map<String, UUID> createPhysicians() {
    return userClient.getPhysicians().stream()
        .collect(
            Collectors.toMap(
                userDto ->
                    userDto.firstName() + userDto.lastName(), // test data keys: firstnameLastname
                UserDto::userId,
                (key, conflictingKey) -> key,
                LinkedHashMap::new));
  }

  private Map<String, UUID> createAppointmentBlockGroups(Map<String, UUID> physicians) {
    UUID physician = physicians.get("TinaHoffmann");

    Instant startBlock_omsNow =
        ZonedDateTime.now(clock)
            .truncatedTo(ChronoUnit.DAYS)
            .plusWeeks(3)
            .plusHours(9L)
            .toInstant();

    //    9th March to test months change in appointment picker
    Instant endBlock_omsNow = startBlock_omsNow.plus(Duration.ofDays(18).plusHours(4L));

    UUID appointmentBlockGroupShort_omsNow =
        appointmentBlockService
            .createDailyAppointmentBlocksForGroup(
                new CreateDailyAppointmentBlockGroupRequest(
                    AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE_SHORT,
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

    UUID appointmentBlockGroupLong_omsNow =
        appointmentBlockService
            .createDailyAppointmentBlocksForGroup(
                new CreateDailyAppointmentBlockGroupRequest(
                    AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE_LONG,
                    2,
                    List.of(
                        new CreateDailyAppointmentBlockDto(
                            startBlock_omsNow,
                            endBlock_omsNow,
                            List.of(DayOfWeekDto.THURSDAY, DayOfWeekDto.FRIDAY))),
                    List.of(physician),
                    List.of(),
                    List.of()))
            .id();

    Map<String, UUID> appointmentBlockGroups = new LinkedHashMap<>();
    appointmentBlockGroups.put(OMS_NOW_SHORT_KEY, appointmentBlockGroupShort_omsNow);
    appointmentBlockGroups.put(OMS_NOW_LONG_KEY, appointmentBlockGroupLong_omsNow);
    return appointmentBlockGroups;
  }
}
