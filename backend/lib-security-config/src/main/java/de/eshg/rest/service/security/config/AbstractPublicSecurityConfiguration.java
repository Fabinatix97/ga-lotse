/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static de.eshg.lib.keycloak.EmployeePermissionRole.BASE_GDPR_VALIDATION_TASK_CLEANUP;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.lib.keycloak.PermissionRole;
import de.eshg.rest.service.security.config.BaseUrls.FourEyesLibrary;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.jetbrains.annotations.CheckReturnValue;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.util.AntPathMatcher;

public abstract class AbstractPublicSecurityConfiguration {

  public static final String BACKEND_BASE_PATH = "/api";

  private final AntPathMatcher antPathMatcher = new AntPathMatcher();
  private final List<PathAuthorizationDefinition> pathAuthorizationDefinitions = new ArrayList<>();
  private final String path;

  protected AbstractPublicSecurityConfiguration(String path) {
    if (path.contains("/")) {
      throw new IllegalArgumentException("Illegal path: " + path);
    }
    this.path = path;
  }

  @VisibleForTesting
  List<PathAuthorizationDefinition> getPathAuthorizationDefinitions() {
    return pathAuthorizationDefinitions;
  }

  public String getPath() {
    return BACKEND_BASE_PATH + "/" + path;
  }

  public AuthorizationDefinition findAuthorizationDefinitionByMethodAndUrl(
      HttpMethod method, String url) {
    if (!url.startsWith(getPath())) {
      return null;
    }
    for (PathAuthorizationDefinition pathAuthorizationDefinition : pathAuthorizationDefinitions) {
      if (pathAuthorizationDefinition.hasMethod(method)) {
        if (antPathMatcher.match(getPath() + pathAuthorizationDefinition.urlPattern(), url)) {
          return pathAuthorizationDefinition.authorizationDefinition();
        }
      }
    }
    return null;
  }

  public void customize(
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry
          authRegistry) {
    for (PathAuthorizationDefinition pathAuthorizationDefinition : pathAuthorizationDefinitions) {
      AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizedUrl authorizedUrl =
          authRegistry.requestMatchers(
              pathAuthorizationDefinition.method(), pathAuthorizationDefinition.urlPattern());
      pathAuthorizationDefinition.authorizationDefinition().customize(authorizedUrl);
    }
  }

  protected void grantAccessToLibAppointmentBlockUrls(
      PermissionRole permissionRole, boolean allowUpdateAppointmentType) {
    requestMatchers(HttpMethod.GET, BaseUrls.LibAppointmentBlock.APPOINTMENT_BLOCK_API + "/**")
        .hasAnyRole(permissionRole, EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(BaseUrls.LibAppointmentBlock.APPOINTMENT_BLOCK_API + "/**")
        .hasRole(permissionRole);

    if (allowUpdateAppointmentType) {
      requestMatchers(HttpMethod.GET, BaseUrls.LibAppointmentBlock.APPOINTMENT_TYPE_API + "/**")
          .hasAnyRole(permissionRole, EmployeePermissionRole.PROCEDURE_ARCHIVE);
      requestMatchers(BaseUrls.LibAppointmentBlock.APPOINTMENT_TYPE_API + "/**")
          .hasRole(permissionRole);
    } else {
      requestMatchers(HttpMethod.GET, BaseUrls.LibAppointmentBlock.APPOINTMENT_TYPE_API + "/**")
          .hasAnyRole(permissionRole, EmployeePermissionRole.PROCEDURE_ARCHIVE);
    }
  }

  protected void grantAccessToLibProceduresUrls(
      PermissionRole procedureAccessRole, ModuleLeaderRole moduleLeaderRole) {
    requestMatchers(GET, ProcedureLibrary.TASKS_TEAM_VIEW)
        .hasRole(moduleLeaderRole.getEmployeePermissionRole());

    requestMatchers(GET, ProcedureLibrary.PROCEDURES_API + "/*/approval-requests")
        .hasRole(moduleLeaderRole.getEmployeePermissionRole());

    requestMatchers(
            GET, ProcedureLibrary.PROCEDURES_API + "/**", ProcedureLibrary.FILES_API + "/**")
        .hasAnyRole(procedureAccessRole, EmployeePermissionRole.PROCEDURE_ARCHIVE);

    requestMatchers(
            GET, ProcedureLibrary.INBOX_PROCEDURES_API + "/**", ProcedureLibrary.TASKS_API + "/**")
        .hasRole(procedureAccessRole);
    requestMatchers(GET, ProcedureLibrary.PROCEDURE_METRICS_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_PROCEDURE_METRICS_READ);
    requestMatchers(GET, ProcedureLibrary.TASK_METRICS_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_PROCEDURE_METRICS_READ);

    requestMatchers(PUT, ProcedureLibrary.TASKS_API + "/*/self-assignment")
        .hasRole(procedureAccessRole);

    requestMatchers(PUT, ProcedureLibrary.TASKS_API + "/*/assignment")
        .hasRole(moduleLeaderRole.getEmployeePermissionRole());

    requestMatchers(POST, ProcedureLibrary.PROGRESS_ENTRIES_API + "/**")
        .hasRole(procedureAccessRole);

    requestMatchers(PUT, ProcedureLibrary.FILES_API + "/**").hasRole(procedureAccessRole);

    requestMatchers(
            DELETE,
            ProcedureLibrary.PROGRESS_ENTRIES_API + "/**",
            ProcedureLibrary.FILES_API + "/**")
        .hasRole(moduleLeaderRole.getEmployeePermissionRole());

    requestMatchers(
            POST, ProcedureLibrary.PROGRESS_ENTRIES_API + "/**", ProcedureLibrary.FILES_API + "/**")
        .hasRole(procedureAccessRole);

    requestMatchers(PATCH, ProcedureLibrary.PROGRESS_ENTRIES_API + "/**")
        .hasRole(procedureAccessRole);

    requestMatchers(POST, ProcedureLibrary.INBOX_PROCEDURES_API + "/**")
        .hasRole(EmployeePermissionRole.INBOX_PROCEDURE_WRITE);

    requestMatchers(PUT, ProcedureLibrary.INBOX_PROCEDURES_API + "/*/inbox-procedure-status")
        .hasRole(procedureAccessRole);

    requestMatchers(GET, FourEyesLibrary.APPROVAL_REQUESTS_API + "/**")
        .hasRole(moduleLeaderRole.getEmployeePermissionRole());

    requestMatchers(PUT, FourEyesLibrary.APPROVAL_REQUESTS_API + "/**")
        .hasRole(moduleLeaderRole.getEmployeePermissionRole());

    requestMatchers(
            POST, ProcedureLibrary.ARCHIVING_API + "/procedures/bulk-update-archiving-relevance")
        .hasAnyRole(
            EmployeePermissionRole.PROCEDURE_ARCHIVE,
            EmployeePermissionRole.PROCEDURE_ARCHIVE_ADMIN);

    requestMatchers(GET, ProcedureLibrary.ARCHIVING_API + "/procedures")
        .hasRole(EmployeePermissionRole.PROCEDURE_ARCHIVE);

    requestMatchers(GET, ProcedureLibrary.ARCHIVING_API + "/relevant-procedures")
        .hasRole(EmployeePermissionRole.PROCEDURE_ARCHIVE_ADMIN);

    requestMatchers(POST, ProcedureLibrary.ARCHIVING_API + "/relevant-procedures/export")
        .hasRole(EmployeePermissionRole.PROCEDURE_ARCHIVE_ADMIN);

    requestMatchers(GET, ProcedureLibrary.ARCHIVING_API + "/config")
        .hasRole(EmployeePermissionRole.PROCEDURE_ARCHIVE);

    gdpr(procedureAccessRole);
  }

  private void gdpr(PermissionRole procedureAccessRole) {
    requestMatchers(
            GET, ProcedureLibrary.GDPR_VALIDATION_TASK_API + "/{gdprProcedureId}/download-packages")
        .hasAnyRole(
            procedureAccessRole,
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ,
            CitizenPermissionRole.BUND_ID_USER,
            CitizenPermissionRole.MUK_USER);
    requestMatchers(
            GET,
            ProcedureLibrary.GDPR_VALIDATION_TASK_API
                + "/{gdprProcedureId}/download-packages/{downloadId}")
        .hasAnyRole(
            procedureAccessRole,
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ,
            CitizenPermissionRole.BUND_ID_USER,
            CitizenPermissionRole.MUK_USER);

    requestMatchers(POST, ProcedureLibrary.PROCEDURES_API + "/check-file-state-usage")
        .hasAnyRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ);
    requestMatchers(DELETE, ProcedureLibrary.GDPR_VALIDATION_TASK_API + "/{gdprProcedureId}")
        .hasRole(BASE_GDPR_VALIDATION_TASK_CLEANUP);

    requestMatchers(GET, ProcedureLibrary.GDPR_VALIDATION_TASK_API + "/**")
        .hasRole(procedureAccessRole);
    requestMatchers(POST, ProcedureLibrary.GDPR_VALIDATION_TASK_API + "/**")
        .hasRole(procedureAccessRole);
    requestMatchers(
            DELETE,
            ProcedureLibrary.GDPR_VALIDATION_TASK_API
                + "/{gdprProcedureId}/business-procedures/{businessProcedureId}")
        .hasRole(procedureAccessRole);
  }

  protected void grantAccessToStatistics(PermissionRole procedureAccessRole) {
    requestMatchers(GET, BaseUrls.STATISTICS + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(POST, BaseUrls.STATISTICS + "/procedure-ids/**").hasRole(procedureAccessRole);
    requestMatchers(POST, BaseUrls.STATISTICS + "/specific-data/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
  }

  @CheckReturnValue
  protected SecurityConfigurationBuilder requestMatchers(
      HttpMethod httpMethod, String... urlPatterns) {
    return new SecurityConfigurationBuilder(httpMethod, Arrays.asList(urlPatterns));
  }

  @CheckReturnValue
  protected SecurityConfigurationBuilder requestMatchers(String... urlPatterns) {
    return requestMatchers(null, urlPatterns);
  }

  protected class SecurityConfigurationBuilder {
    private final HttpMethod httpMethod;
    private final List<String> urlPatterns;

    protected SecurityConfigurationBuilder(HttpMethod httpMethod, List<String> urlPatterns) {
      this.httpMethod = httpMethod;
      this.urlPatterns = urlPatterns;
    }

    protected void hasRole(PermissionRole permissionRole) {
      hasAnyRole(permissionRole);
    }

    public void hasAnyRole(PermissionRole... permissionRoles) {
      defineAuthorization(new AnyRole(permissionRoles));
    }

    public void authenticated() {
      defineAuthorization(new Authenticated());
    }

    public void permitAll() {
      defineAuthorization(new PermitAll());
    }

    private void defineAuthorization(AuthorizationDefinition authorizationDefinition) {
      for (String baseUrl : urlPatterns) {
        pathAuthorizationDefinitions.add(
            new PathAuthorizationDefinition(httpMethod, baseUrl, authorizationDefinition));
      }
    }
  }
}
