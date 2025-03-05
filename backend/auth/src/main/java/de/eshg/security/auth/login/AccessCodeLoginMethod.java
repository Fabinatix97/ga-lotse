/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import com.google.common.annotations.VisibleForTesting;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.security.auth.AuthProperties;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class AccessCodeLoginMethod extends LoginMethod {
  private static final Logger log = LoggerFactory.getLogger(AccessCodeLoginMethod.class);

  public static final String ACCESS_CODE_QUERY_PARAMETER = "access_code";
  public static final Pattern ACCESS_CODE_REGEX = Pattern.compile("[a-zA-Z0-9]{17}");

  public AccessCodeLoginMethod(AuthProperties authProperties) {
    super(authProperties);
  }

  @Override
  protected List<String> getPathPatterns() {
    return authProperties.getAccessCodeLoginProperties().values().stream()
        .flatMap(Collection::stream)
        .toList();
  }

  @Override
  protected void applyParameters(Map<String, Object> params, String redirectUrl) {
    AccessCodeLoginType accessCodeLoginType = getAccessCodeLoginType(redirectUrl);
    params.put("prompt", determineCredentialProviderId(accessCodeLoginType));

    // See de.eshg.keycloak.authenticator.DateOfBirthAccessCodeForm
    determineContextInfoKey(accessCodeLoginType)
        .ifPresent(contextInfoKey -> params.put("context_info", contextInfoKey));

    getAndValidateAccessCode(redirectUrl)
        .ifPresent(
            validAccessCode -> {
              log.debug("Passing access code to authorization URL");
              params.put(ACCESS_CODE_QUERY_PARAMETER, validAccessCode);
            });
  }

  private AccessCodeLoginType getAccessCodeLoginType(String redirectUrl) {
    return authProperties.getAccessCodeLoginProperties().entrySet().stream()
        .filter(entry -> isApplicable(redirectUrl, entry.getValue()))
        .map(Map.Entry::getKey)
        .collect(StreamUtil.toSingleElement());
  }

  private static String determineCredentialProviderId(AccessCodeLoginType variant) {
    return switch (variant) {
      case SCHOOL_ENTRY, TRAVEL_MEDICINE, OFFICIAL_MEDICAL_SERVICE ->
          "date-of-birth"; // DateOfBirthCredentialProvider
      case STI_PROTECTION -> "pin"; // PinCredentialProvider
    };
  }

  private static Optional<String> determineContextInfoKey(AccessCodeLoginType variant) {
    return Optional.ofNullable(
        switch (variant) {
          case SCHOOL_ENTRY -> "esu";
          case TRAVEL_MEDICINE -> "tm";
          case OFFICIAL_MEDICAL_SERVICE -> "oms";
          case STI_PROTECTION -> null;
        });
  }

  private static Optional<String> getAndValidateAccessCode(String url) {
    return UriComponentsBuilder.fromUriString(url)
        .build()
        .getQueryParams()
        .getOrDefault(ACCESS_CODE_QUERY_PARAMETER, List.of())
        .stream()
        .collect(StreamUtil.toSingleOptionalElement())
        .flatMap(AccessCodeLoginMethod::validateAccessCode);
  }

  @VisibleForTesting
  public static Optional<String> validateAccessCode(String accessCode) {
    if (!ACCESS_CODE_REGEX.matcher(accessCode).matches()) {
      log.debug("Rejecting invalid access code: '{}'", accessCode);
      return Optional.empty();
    }
    return Optional.of(accessCode);
  }
}
