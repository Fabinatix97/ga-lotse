/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import io.micrometer.common.util.StringUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.apache.commons.lang3.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.ConstructorBinding;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "eshg.keycloak")
public record KeycloakProperties(
    @NotBlank String url,
    @Valid @NotNull Internal internal,
    @Valid @NotNull KeycloakProperties.BootstrapAdmin bootstrapAdmin,
    @Valid @NotNull AdminClient adminClient,
    @Valid @NotNull SetupAdmin setupAdmin,
    @Valid @NotNull EmployeeRealm employeeRealm,
    @Valid @NotNull CitizenRealm citizenRealm,
    @Valid @NotNull Smtp smtp,
    @NotNull Duration eventExpiration,
    @NotNull Duration sessionTimeout,
    @NotNull Duration adminSessionTimeout,
    @NotNull Duration adminSessionLimit,
    @NotNull Boolean testClientEnabled,
    @NotNull Boolean provisionTestUsers,
    @NotNull Boolean allowPasswordsForEmployees,
    String testUsersSecretOverride,
    @Valid @NotNull KeycloakProperties.IdpTestRealm mukTestRealm,
    @Valid @NotNull KeycloakProperties.IdpTestRealm bundIdTestRealm) {

  private static final Logger log = LoggerFactory.getLogger(KeycloakProperties.class);
  public static final String CONDITIONAL_NOT_BLANK_ERROR_MESSAGE =
      "%s cannot be blank if %s is enabled, but was %s";

  public KeycloakProperties(
      String url,
      Internal internal,
      BootstrapAdmin bootstrapAdmin,
      AdminClient adminClient,
      SetupAdmin setupAdmin,
      EmployeeRealm employeeRealm,
      CitizenRealm citizenRealm,
      Smtp smtp,
      Duration eventExpiration,
      Duration sessionTimeout,
      Duration adminSessionTimeout,
      Duration adminSessionLimit,
      Boolean testClientEnabled,
      Boolean provisionTestUsers,
      Boolean allowPasswordsForEmployees,
      String testUsersSecretOverride,
      IdpTestRealm mukTestRealm,
      IdpTestRealm bundIdTestRealm) {
    this.url = url;
    this.internal = internal;
    this.bootstrapAdmin = bootstrapAdmin;
    this.adminClient = adminClient;
    this.setupAdmin =
        setupAdmin != null ? setupAdmin : new SetupAdmin(null, null, false, Duration.ofDays(3));
    this.employeeRealm = employeeRealm;
    this.citizenRealm = citizenRealm;
    this.smtp = smtp;
    this.eventExpiration = eventExpiration;
    this.sessionTimeout = sessionTimeout;
    this.adminSessionTimeout = adminSessionTimeout;
    this.adminSessionLimit = adminSessionLimit;
    this.testClientEnabled = BooleanUtils.isTrue(testClientEnabled);
    this.provisionTestUsers = BooleanUtils.isTrue(provisionTestUsers);
    this.allowPasswordsForEmployees = BooleanUtils.isTrue(allowPasswordsForEmployees);
    this.testUsersSecretOverride = testUsersSecretOverride;
    this.mukTestRealm = mukTestRealm != null ? mukTestRealm : new IdpTestRealm(false, null);
    this.bundIdTestRealm =
        bundIdTestRealm != null ? bundIdTestRealm : new IdpTestRealm(false, null);

    log.info("Keycloak URL: {}", url);
    log.info("Keycloak internal URL: {}", internal != null ? internal.url() : null);
  }

  public interface Realm {
    String name();

    String displayName();

    String authClientSecret();

    Boolean sslRequired();
  }

  public record EmployeeRealm(
      @NotBlank String name,
      @NotBlank String displayName,
      @NotBlank String authClientSecret,
      @NotNull Boolean sslRequired,
      @NotNull Map<ModuleClient, String> moduleClientSecrets)
      implements Realm {

    public EmployeeRealm(
        String name,
        String displayName,
        String authClientSecret,
        Boolean sslRequired,
        Map<ModuleClient, String> moduleClientSecrets) {
      this.name = name;
      this.displayName = displayName;
      this.authClientSecret = authClientSecret;
      this.sslRequired = !BooleanUtils.isFalse(sslRequired);
      this.moduleClientSecrets = moduleClientSecrets != null ? moduleClientSecrets : Map.of();
    }
  }

  public record CitizenRealm(
      @NotBlank String name,
      @NotBlank String displayName,
      @NotBlank String authClientSecret,
      @NotNull Boolean sslRequired,
      @Valid @NotNull IdentityProvider mukIdp,
      @Valid @NotNull IdentityProvider bundIdIdp)
      implements Realm {

    public CitizenRealm(
        String name,
        String displayName,
        String authClientSecret,
        Boolean sslRequired,
        IdentityProvider mukIdp,
        IdentityProvider bundIdIdp) {
      this.name = name;
      this.displayName = displayName;
      this.authClientSecret = authClientSecret;
      this.sslRequired = !BooleanUtils.isFalse(sslRequired);
      this.mukIdp = mukIdp != null ? mukIdp : new IdentityProvider(false);
      this.bundIdIdp = bundIdIdp != null ? bundIdIdp : new IdentityProvider(false);
    }
  }

  public record IdpTestRealm(@NotNull Boolean enabled, String signatureKey) {

    public IdpTestRealm {
      if (BooleanUtils.isTrue(enabled)) {
        Optional<String> validationErrorMessage =
            validateNotBlankAttributeForEnabledConfig(
                signatureKey, "signatureKey", IdpTestRealm.class);
        if (validationErrorMessage.isPresent()) {
          throw new IllegalArgumentException(validationErrorMessage.get());
        }
      }
    }
  }

  public record IdentityProvider(
      @NotNull Boolean enabled,
      String entityId,
      String singleSignOnServiceUrl,
      String signingCertificate,
      String signatureAlgorithm,
      String encryptionAlgorithm) {

    @ConstructorBinding
    public IdentityProvider {
      List<String> validationErrorMessages = new ArrayList<>();
      if (BooleanUtils.isTrue(enabled)) {
        validateNotBlankAttributeForEnabledConfig(entityId, "entityId", IdentityProvider.class)
            .ifPresent(validationErrorMessages::add);
        validateNotBlankAttributeForEnabledConfig(
                singleSignOnServiceUrl, "singleSignOnServiceUrl", IdentityProvider.class)
            .ifPresent(validationErrorMessages::add);
        validateNotBlankAttributeForEnabledConfig(
                signingCertificate, "signingCertificate", IdentityProvider.class)
            .ifPresent(validationErrorMessages::add);
        validateNotBlankAttributeForEnabledConfig(
                signatureAlgorithm, "signatureAlgorithm", IdentityProvider.class)
            .ifPresent(validationErrorMessages::add);
        validateNotBlankAttributeForEnabledConfig(
                encryptionAlgorithm, "encryptionAlgorithm", IdentityProvider.class)
            .ifPresent(validationErrorMessages::add);
      }

      if (!validationErrorMessages.isEmpty()) {
        throw new IllegalArgumentException(String.join("\n", validationErrorMessages));
      }
    }

    public IdentityProvider(boolean enabled) {
      this(enabled, null, null, null, null, null);
    }
  }

  public record Smtp(
      @NotBlank String from,
      @NotBlank String host,
      @NotNull Integer port,
      @NotNull Boolean sslEnabled,
      @NotBlank String username,
      @NotBlank String password) {}

  public record Internal(@NotBlank String url) {}

  public record BootstrapAdmin(
      @NotBlank String user, @NotBlank String password, @NotNull Boolean enabled) {}

  public record AdminClient(@NotBlank String clientId, @NotBlank String clientSecret) {
    public String getKeycloakClientId() {
      return RealmBoundKeycloakClient.SYSTEM_CLIENT_ID_PREFIX + clientId;
    }

    public String getKeycloakClientSecret() {
      return clientSecret;
    }
  }

  public record SetupAdmin(
      String username, String email, @NotNull Boolean enabled, @NotNull Duration emailLifetime) {

    public SetupAdmin {
      if (BooleanUtils.isTrue(enabled)) {
        List<String> validationErrorMessages = new ArrayList<>();

        validateNotBlankAttributeForEnabledConfig(username, "username", SetupAdmin.class)
            .ifPresent(validationErrorMessages::add);
        validateNotBlankAttributeForEnabledConfig(email, "email", SetupAdmin.class)
            .ifPresent(validationErrorMessages::add);

        if (!validationErrorMessages.isEmpty()) {
          throw new IllegalArgumentException(String.join("\n", validationErrorMessages));
        }
      }
    }
  }

  private static Optional<String> validateNotBlankAttributeForEnabledConfig(
      String validatedAttributeValue, String validatedAttributeName, Class<?> configClass) {
    if (StringUtils.isBlank(validatedAttributeValue)) {
      return Optional.of(
          CONDITIONAL_NOT_BLANK_ERROR_MESSAGE.formatted(
              validatedAttributeName,
              configClass.getSimpleName(),
              renderValueForMessage(validatedAttributeValue)));
    }
    return Optional.empty();
  }

  private static String renderValueForMessage(String validatedAttributeValue) {
    return validatedAttributeValue == null ? "<null>" : "'%s'".formatted(validatedAttributeValue);
  }
}
