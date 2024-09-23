/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring.config;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.label.LabelApi;
import de.eshg.base.mail.MailApi;
import de.eshg.base.street.StreetApi;
import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.statistics.StatisticsApi;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.config.BaseUrls;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;

@Configuration
public class BaseInternalSecurityConfig {

  private static final String ARCHIVE_DELETION = "/archive-deletion";

  @Bean
  public AuthorizationCustomizer authorizationCustomizer() {
    return auth -> {
      users(auth);
      citizenUsers(auth);
      accessCodeUsers(auth);
      facilities(auth);
      persons(auth);
      mail(auth);

      auth.requestMatchers(POST, InventoryApi.BASE_URL + "/*" + InventoryApi.BOOKING + "/**")
          .hasRole(EmployeePermissionRole.BASE_INVENTORY_USE.getKeycloakName());
      auth.requestMatchers(POST, ContactApi.BASE_URL + BaseUrls.Base.BULK_GET_URL_END)
          .hasRole(EmployeePermissionRole.BASE_CONTACTS_READ.getKeycloakName());
      auth.requestMatchers(PUT, LabelApi.BASE_URL + "/**")
          .hasRole(EmployeePermissionRole.BASE_LABELS_WRITE.getKeycloakName());

      auth.requestMatchers(GET, StatisticsApi.BASE_URL + "/**")
          .hasAnyRole(
              EmployeePermissionRole.STATISTICS_STATISTICS_READ.getKeycloakName(),
              EmployeePermissionRole.STATISTICS_STATISTICS_WRITE.getKeycloakName());
      auth.requestMatchers(POST, StatisticsApi.BASE_URL + "/**")
          .hasAnyRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE.getKeycloakName());
      auth.requestMatchers(StreetApi.BASE_URL + "/**")
          .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE.getKeycloakName());

      // To be removed together with the simulators, when we start calling actual services
      auth.requestMatchers("/simulator/**").authenticated();
    };
  }

  private static void users(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(
            GET,
            BaseUrls.Base.USER_API
                + BaseUrls.Base.USER_KEYS_URL
                + BaseUrls.Base.USER_PUBLIC_KEYS_URL)
        .hasRole(EmployeePermissionRole.AUDITLOG_PUBLIC_KEYS_READ.getKeycloakName());
    auth.requestMatchers(GET, BaseUrls.Base.USER_API)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE.getKeycloakName());
    auth.requestMatchers(POST, BaseUrls.Base.USER_API + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE.getKeycloakName());
  }

  private static void citizenUsers(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(GET, BaseUrls.Base.CITIZEN_USER_API + "/**")
        .hasRole(CitizenPermissionRole.STANDARD_CITIZEN.getKeycloakName());
  }

  private static void accessCodeUsers(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(GET, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN.getKeycloakName());
    auth.requestMatchers(POST, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN.getKeycloakName());
    auth.requestMatchers(DELETE, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN.getKeycloakName());
  }

  private static void facilities(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(
            POST,
            FacilityApi.BASE_URL + FacilityApi.FILE_STATES_URL + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_READ.getKeycloakName());
    auth.requestMatchers(
            POST, FacilityApi.BASE_URL + FacilityApi.FILE_STATES_URL + ARCHIVE_DELETION)
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_DELETE.getKeycloakName());

    auth.requestMatchers(
            POST,
            FacilityApi.BASE_URL
                + FacilityApi.FILE_STATES_URL
                + BaseUrls.Base.FACILITY_EXTERNAL_DATA_SOURCE_URL)
        .permitAll();

    auth.requestMatchers(POST, FacilityApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_WRITE.getKeycloakName());
    auth.requestMatchers(GET, FacilityApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_READ.getKeycloakName());
  }

  private static void persons(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(
            POST, PersonApi.BASE_URL + PersonApi.FILE_STATES_URL + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.BASE_PERSONS_READ.getKeycloakName());
    auth.requestMatchers(POST, PersonApi.BASE_URL + PersonApi.FILE_STATES_URL + ARCHIVE_DELETION)
        .hasRole(EmployeePermissionRole.BASE_PERSONS_DELETE.getKeycloakName());

    auth.requestMatchers(
            POST,
            PersonApi.BASE_URL
                + PersonApi.FILE_STATES_URL
                + BaseUrls.Base.PERSON_EXTERNAL_DATA_SOURCE_URL)
        .permitAll();

    auth.requestMatchers(GET, BaseUrls.Base.PERSON_API + PersonApi.FILE_STATES_URL + "/*")
        .hasAnyRole(
            EmployeePermissionRole.BASE_PERSONS_READ.getKeycloakName(),
            CitizenPermissionRole.ACCESS_CODE_USER.getKeycloakName());

    auth.requestMatchers(POST, PersonApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_PERSONS_WRITE.getKeycloakName());
    auth.requestMatchers(GET, PersonApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_PERSONS_READ.getKeycloakName());
  }

  private static void mail(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(POST, MailApi.BASE_URL)
        .hasRole(EmployeePermissionRole.BASE_MAIL_SEND.getKeycloakName());
    auth.requestMatchers(POST, MailApi.BASE_URL + MailApi.NOTIFICATION_SUFFIX)
        .hasRole(EmployeePermissionRole.BASE_MAIL_SEND.getKeycloakName());
  }
}
