/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring.config;

import static de.eshg.base.gdpr.GdprProcedureApi.BY_ID;
import static de.eshg.base.gdpr.GdprProcedureApi.DELETE_DOWNLOADS;
import static de.eshg.base.gdpr.GdprProcedureApi.DOWNLOADS;
import static de.eshg.base.gdpr.GdprProcedureApi.FILE_STATE_IDS;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.gdpr.GdprProcedureApi;
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
  AuthorizationCustomizer authorizationCustomizer() {
    return auth -> {
      users(auth);
      citizenUsers(auth);
      accessCodeUsers(auth);
      facilities(auth);
      persons(auth);
      mail(auth);
      gdpr(auth);

      auth.requestMatchers(POST, InventoryApi.BASE_URL + "/*" + InventoryApi.BOOKING + "/**")
          .hasRole(EmployeePermissionRole.BASE_INVENTORY_USE.name());
      auth.requestMatchers(POST, ContactApi.BASE_URL + BaseUrls.Base.BULK_GET_URL_END)
          .hasAnyRole(
              EmployeePermissionRole.BASE_CONTACTS_READ.name(),
              EmployeePermissionRole.PROCEDURE_ARCHIVE.name());
      auth.requestMatchers(PUT, LabelApi.BASE_URL + "/**")
          .hasRole(EmployeePermissionRole.BASE_LABELS_WRITE.name());

      auth.requestMatchers(GET, StatisticsApi.BASE_URL + "/**")
          .hasAnyRole(
              EmployeePermissionRole.STATISTICS_STATISTICS_READ.name(),
              EmployeePermissionRole.STATISTICS_STATISTICS_WRITE.name());
      auth.requestMatchers(POST, StatisticsApi.BASE_URL + "/data-table-header/**")
          .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE.name());
      auth.requestMatchers(POST, StatisticsApi.BASE_URL + "/specific-data/**")
          .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_TECHNICAL_USER.name());
      auth.requestMatchers(StreetApi.BASE_URL + "/**")
          .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE.name());
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
        .hasRole(EmployeePermissionRole.AUDITLOG_PUBLIC_KEYS_READ.name());
    auth.requestMatchers(GET, BaseUrls.Base.USER_API)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE.name());
    auth.requestMatchers(POST, BaseUrls.Base.USER_API + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE.name());
  }

  private static void citizenUsers(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(GET, BaseUrls.Base.CITIZEN_USER_API + "/**")
        .hasRole(CitizenPermissionRole.STANDARD_CITIZEN.name());
  }

  private static void accessCodeUsers(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(POST, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/{id}/verify")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_VERIFY.name());
    auth.requestMatchers(PUT, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/credential")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER.name());
    auth.requestMatchers(GET, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN.name());
    auth.requestMatchers(POST, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN.name());
    auth.requestMatchers(DELETE, BaseUrls.Base.CITIZEN_ACCESS_CODE_USER_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_ACCESS_CODE_USER_ADMIN.name());
  }

  private static void facilities(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(
            POST,
            FacilityApi.BASE_URL + FacilityApi.FILE_STATES_URL + BaseUrls.Base.BULK_GET_URL_END)
        .hasAnyRole(
            EmployeePermissionRole.BASE_FACILITIES_READ.name(),
            EmployeePermissionRole.PROCEDURE_ARCHIVE.name());
    auth.requestMatchers(
            POST, FacilityApi.BASE_URL + FacilityApi.FILE_STATES_URL + ARCHIVE_DELETION)
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_DELETE.name());

    auth.requestMatchers(
            POST,
            FacilityApi.BASE_URL
                + FacilityApi.FILE_STATES_URL
                + BaseUrls.Base.FACILITY_EXTERNAL_DATA_SOURCE_URL)
        .permitAll();

    auth.requestMatchers(POST, FacilityApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_WRITE.name());
    auth.requestMatchers(GET, FacilityApi.BASE_URL + "/**")
        .hasAnyRole(
            EmployeePermissionRole.BASE_FACILITIES_READ.name(),
            EmployeePermissionRole.PROCEDURE_ARCHIVE.name(),
            EmployeePermissionRole.PROCEDURE_ARCHIVE_ADMIN.name());
  }

  private static void persons(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(
            POST, PersonApi.BASE_URL + PersonApi.FILE_STATES_URL + BaseUrls.Base.BULK_GET_URL_END)
        .hasAnyRole(
            EmployeePermissionRole.BASE_PERSONS_READ.name(),
            EmployeePermissionRole.PROCEDURE_ARCHIVE.name());
    auth.requestMatchers(POST, PersonApi.BASE_URL + PersonApi.FILE_STATES_URL + ARCHIVE_DELETION)
        .hasRole(EmployeePermissionRole.BASE_PERSONS_DELETE.name());

    auth.requestMatchers(
            POST,
            PersonApi.BASE_URL
                + PersonApi.FILE_STATES_URL
                + BaseUrls.Base.PERSON_EXTERNAL_DATA_SOURCE_URL)
        .permitAll();

    auth.requestMatchers(GET, BaseUrls.Base.PERSON_API + PersonApi.FILE_STATES_URL + "/*")
        .hasAnyRole(
            EmployeePermissionRole.BASE_PERSONS_READ.name(),
            CitizenPermissionRole.ACCESS_CODE_USER.name(),
            EmployeePermissionRole.PROCEDURE_ARCHIVE.name());

    auth.requestMatchers(GET, BaseUrls.Base.PERSON_API + PersonApi.FILE_STATES_URL + "/**")
        .hasAnyRole(
            EmployeePermissionRole.BASE_PERSONS_READ.name(),
            EmployeePermissionRole.PROCEDURE_ARCHIVE.name());

    auth.requestMatchers(POST, PersonApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_PERSONS_WRITE.name());
    auth.requestMatchers(GET, PersonApi.BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_PERSONS_READ.name());
  }

  private static void mail(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(POST, MailApi.BASE_URL)
        .hasRole(EmployeePermissionRole.BASE_MAIL_SEND.name());
    auth.requestMatchers(POST, MailApi.BASE_URL + MailApi.NOTIFICATION_SUFFIX)
        .hasRole(EmployeePermissionRole.BASE_MAIL_SEND.name());
  }

  private static void gdpr(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          auth) {
    auth.requestMatchers(GET, GdprProcedureApi.BASE_URL + BY_ID)
        .hasAnyRole(
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ.name(),
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_REVIEW.name(),
            CitizenPermissionRole.BUND_ID_USER.name(),
            CitizenPermissionRole.MUK_USER.name());
    auth.requestMatchers(GET, GdprProcedureApi.BASE_URL + DOWNLOADS)
        .hasAnyRole(
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_REVIEW.name(),
            CitizenPermissionRole.BUND_ID_USER.name(),
            CitizenPermissionRole.MUK_USER.name());
    auth.requestMatchers(GET, GdprProcedureApi.BASE_URL + FILE_STATE_IDS)
        .hasAnyRole(
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ.name(),
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_REVIEW.name());

    auth.requestMatchers(POST, GdprProcedureApi.BASE_URL + DOWNLOADS)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_REVIEW.name());

    auth.requestMatchers(POST, GdprProcedureApi.BASE_URL + DELETE_DOWNLOADS)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_REVIEW.name());
  }
}
