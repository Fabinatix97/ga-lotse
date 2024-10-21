/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.calendar.CalendarEventService;
import de.eshg.base.calendar.CalendarService;
import de.eshg.base.calendar.api.BaseEventRequest;
import de.eshg.base.calendar.api.BaseEventTypeDto;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.ShowAs;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.base.citizenuser.AccessCodeGenerator;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.SearchContactsResponse;
import de.eshg.base.inventory.api.GetInventoryItemsResponse;
import de.eshg.base.inventory.api.InventoryItemDto;
import de.eshg.base.keycloak.*;
import de.eshg.base.resource.api.GetResourcesResponse;
import de.eshg.base.resource.api.ResourceDto;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsRequest;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.lib.keycloak.EmployeeTestUser;
import de.eshg.lib.keycloak.Realm;
import de.eshg.lib.keycloak.UsernamePassword;
import de.eshg.testhelper.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.http.impl.client.HttpClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.engines.ApacheHttpClient43Engine;
import org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@ConditionalOnTestHelperEnabled
@Service
public class BaseTestHelperService extends DefaultTestHelperService {

  private static final Logger log = LoggerFactory.getLogger(BaseTestHelperService.class);

  private static final Duration CLOCK_SKEW = Duration.ofMinutes(1);

  private final KeycloakProperties keycloakProperties;
  private final EmployeeKeycloakTestClient employeeKeycloakTestClient;
  private final CitizenKeycloakTestClient citizenKeycloakTestClient;
  private final CitizenKeycloakTestProvisioning citizenKeycloakTestProvisioning;
  private final HealthDepartmentContactPopulator healthDepartmentContactPopulator;

  private final CalendarService calendarService;

  private final CalendarEventService calendarEventService;
  private final AccessCodeGenerator accessCodeGenerator;
  private final ResourcePopulator resourcePopulator;
  private final InventoryPopulator inventoryPopulator;
  private final ContactPopulator contactPopulator;
  private final SchoolContactPopulator schoolContactPopulator;

  private final Map<UsernamePassword, AccessToken> cachedAccessTokens = new ConcurrentHashMap<>();

  public BaseTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      EmployeeKeycloakTestClient employeeKeycloakTestClient,
      CitizenKeycloakTestProvisioning citizenKeycloakTestProvisioning,
      KeycloakProperties keycloakProperties,
      CitizenKeycloakTestClient citizenKeycloakTestClient,
      CalendarService calendarService,
      CalendarEventService calendarEventService,
      AccessCodeGenerator accessCodeGenerator,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      ResourcePopulator resourcePopulator,
      InventoryPopulator inventoryPopulator,
      ContactPopulator contactPopulator,
      SchoolContactPopulator schoolContactPopulator,
      EnvironmentConfig environmentConfig,
      HealthDepartmentContactPopulator healthDepartmentContactPopulator) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        environmentConfig);
    this.calendarService = calendarService;
    this.calendarEventService = calendarEventService;
    this.resourcePopulator = resourcePopulator;
    this.keycloakProperties = keycloakProperties;
    this.employeeKeycloakTestClient = employeeKeycloakTestClient;
    this.citizenKeycloakTestClient = citizenKeycloakTestClient;
    this.inventoryPopulator = inventoryPopulator;
    this.contactPopulator = contactPopulator;
    this.schoolContactPopulator = schoolContactPopulator;
    this.accessCodeGenerator = accessCodeGenerator;
    this.citizenKeycloakTestProvisioning = citizenKeycloakTestProvisioning;
    this.healthDepartmentContactPopulator = healthDepartmentContactPopulator;
  }

  public void resetKeycloak() {
    environmentConfig.assertIsNotProduction();
    employeeKeycloakTestClient.resetUser(EmployeeTestUser.DUMMY);
    employeeKeycloakTestClient.resetUser(EmployeeTestUser.WORK_COUNCIL_DUMMY);
    employeeKeycloakTestClient.deleteUser(KeycloakTestClient.TEMPORARY_TEST_USER_USERNAME);
    employeeKeycloakTestClient.resetEvents();

    citizenKeycloakTestProvisioning.removeUnmanagedUsers();
    citizenKeycloakTestProvisioning.createOrUpdateUsers();
    accessCodeGenerator.reset();
  }

  public void invalidateAllKeycloakSessions() {
    environmentConfig.assertIsNotProduction();
    employeeKeycloakTestClient.invalidateAllSessions(
        KeycloakProvisioning.ESHG_AUTH_SERVICE_CLIENT_ID);
    cachedAccessTokens.clear();
  }

  public void deleteKeycloakUser(String username) {
    environmentConfig.assertIsNotProduction();
    employeeKeycloakTestClient.deleteUser(username);
  }

  public UserDto createTemporaryTestUser() {
    environmentConfig.assertIsNotProduction();
    UserRepresentation testUser = employeeKeycloakTestClient.createTemporaryTestUser();
    return UserMapper.mapUserToApi(testUser);
  }

  public AccessToken login(UsernamePassword usernamePassword) {
    // Logins take ~100ms on a T14 (Gen3) with an Intel i7 1270P.
    // So caching the tokens is important for overall test performance.
    AccessToken accessToken =
        cachedAccessTokens.computeIfAbsent(usernamePassword, this::loginUncached);
    if (hasExpired(accessToken)) {
      log.info("Cached access token expired. Obtaining a new access token");
      accessToken = loginUncached(usernamePassword);
      cachedAccessTokens.replace(usernamePassword, accessToken);
    }
    return accessToken;
  }

  public AccessToken loginAsCitizenAccessCodeUser(UUID citizenUserId) {
    UsernamePassword usernamePassword =
        citizenKeycloakTestClient.getUsernameAndPasswordOfCitizenAccessCodeUser(citizenUserId);
    return login(usernamePassword);
  }

  private static boolean hasExpired(AccessToken accessToken) {
    return Instant.now().isAfter(accessToken.expiresAt().minus(CLOCK_SKEW));
  }

  public AccessToken loginUncached(UsernamePassword usernamePassword) {
    return loginUncached(usernamePassword, null);
  }

  public AccessToken loginUncached(UsernamePassword usernamePassword, String userAgent) {
    environmentConfig.assertIsNotProduction();
    try (Keycloak keycloak =
        KeycloakBuilder.builder()
            .serverUrl(keycloakProperties.internal().url())
            .grantType(OAuth2Constants.PASSWORD)
            .realm(getRealmName(usernamePassword.realm()))
            .scope(OAuth2Constants.SCOPE_OPENID)
            .clientId(KeycloakTestProvisioning.TEST_HELPER_CLIENT_ID)
            .username(usernamePassword.username())
            .password(usernamePassword.password())
            .resteasyClient(getResteasyClient(userAgent))
            .build()) {
      AccessTokenResponse accessTokenResponse = keycloak.tokenManager().getAccessToken();
      Assert.isTrue(
          accessTokenResponse.getTokenType().equals("Bearer"),
          () ->
              "Access token of type 'Bearer' expected but got: "
                  + accessTokenResponse.getTokenType());
      AccessToken accessToken =
          new AccessToken(
              accessTokenResponse.getToken(),
              Instant.now().plusSeconds(accessTokenResponse.getExpiresIn()));
      Assert.isTrue(!hasExpired(accessToken), () -> "The new access token already expired");
      return accessToken;
    }
  }

  private static ResteasyClient getResteasyClient(String userAgent) {
    return new ResteasyClientBuilderImpl()
        .httpEngine(
            new ApacheHttpClient43Engine(
                HttpClientBuilder.create().setUserAgent(userAgent).build()))
        .build();
  }

  private String getRealmName(Realm realm) {
    return switch (realm) {
      case EMPLOYEES -> keycloakProperties.employeeRealm().name();
      case CITIZENS -> keycloakProperties.citizenRealm().name();
    };
  }

  public CreateCalendarTestEventsResponse createCalendarTestEvents(
      CreateCalendarTestEventsRequest request) {
    environmentConfig.assertIsNotProduction();

    UserCalendar currentUserCalendar = calendarService.getCurrentUserCalendar();

    createEvents(request, currentUserCalendar).forEach(calendarEventService::addBaseEvent);

    return new CreateCalendarTestEventsResponse(currentUserCalendar.calendarId());
  }

  private List<BaseEventRequest> createEvents(
      CreateCalendarTestEventsRequest request, UserCalendar currentUserCalendar) {

    List<BaseEventRequest> events = new ArrayList<>();

    Random random = new Random(1707227574405L);

    int wholeDayEventCount = request.wholeDayEventCount();
    int subDayEventCount = request.subDayEventCount();

    long minutesInADay = Duration.ofDays(1).toMinutes();

    ZonedDateTime nextStart = ZonedDateTime.now(clock);

    int overallEventCount = wholeDayEventCount + subDayEventCount;

    for (int i = 0; i < overallEventCount; i++) {
      long pseudoRandomLength = random.nextLong(2 * minutesInADay);

      boolean wholeDay;
      if (wholeDayEventCount > 0 && subDayEventCount > 0) {
        wholeDay = random.nextBoolean();
      } else {
        wholeDay = wholeDayEventCount != 0;
      }

      if (wholeDay) {
        wholeDayEventCount = wholeDayEventCount - 1;
      } else {
        subDayEventCount = subDayEventCount - 1;
      }

      events.add(
          new BaseEventRequest(
              currentUserCalendar.calendarId(),
              BaseEventTypeDto.VACATION,
              ShowAs.BUSY,
              "Test Event %d".formatted(i),
              new EventTimeData(
                  nextStart.toInstant(),
                  nextStart.plusMinutes(pseudoRandomLength).toInstant(),
                  wholeDay)));

      nextStart = nextStart.plusMinutes(pseudoRandomLength).plusDays(1);
    }
    return events;
  }

  public GetResourcesResponse populateResources(int numberOfEntitiesToPopulate) {
    ListWithTotalNumber<ResourceDto> result =
        resourcePopulator.populate(numberOfEntitiesToPopulate);
    return new GetResourcesResponse(result.entities(), result.totalNumberOfElements());
  }

  public GetInventoryItemsResponse populateInventory(int numberOfEntitiesToPopulate) {
    ListWithTotalNumber<InventoryItemDto> result =
        inventoryPopulator.populate(numberOfEntitiesToPopulate);
    return new GetInventoryItemsResponse(result.entities(), result.totalNumberOfElements());
  }

  public SearchContactsResponse populateContacts(int numberOfEntitiesToPopulate) {
    ListWithTotalNumber<ContactDto> result = contactPopulator.populate(numberOfEntitiesToPopulate);
    return new SearchContactsResponse(result.entities(), result.totalNumberOfElements());
  }

  public SearchContactsResponse populateSchoolContacts(int numberOfEntitiesToPopulate) {
    ListWithTotalNumber<ContactDto> result =
        schoolContactPopulator.populate(numberOfEntitiesToPopulate);
    return new SearchContactsResponse(result.entities(), result.totalNumberOfElements());
  }

  public SearchContactsResponse populateHealthDepartmentsContacts(int numberOfEntitiesToPopulate) {
    ListWithTotalNumber<ContactDto> result =
        healthDepartmentContactPopulator.populate(numberOfEntitiesToPopulate);
    return new SearchContactsResponse(result.entities(), result.totalNumberOfElements());
  }
}
