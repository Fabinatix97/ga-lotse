/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import java.util.List;
import java.util.Map;

public interface KeycloakUserAttribute {
  String DEFAULT_ATTRIBUTE_USERNAME = "username";
  String DEFAULT_ATTRIBUTE_FIRST_NAME = "firstName";
  String DEFAULT_ATTRIBUTE_LAST_NAME = "lastName";
  String DEFAULT_ATTRIBUTE_EMAIL = "email";

  ValidationRule[] DEFAULT_USERNAME_VALIDATIONS =
      new ValidationRule[] {
        new ValidationRule.Length(3, 255),
        new ValidationRule.Default("up-username-not-idn-homograph", Map.of()),
        new ValidationRule.Default("username-prohibited-characters", Map.of()),
      };

  ValidationRule[] DEFAULT_EMAIL_VALIDATIONS =
      new ValidationRule[] {
        new ValidationRule.Default("email", Map.of()),
        new ValidationRule.Default("length", Map.of("max", 255))
      };

  ValidationRule[] DEFAULT_NAME_VALIDATIONS =
      new ValidationRule[] {
        new ValidationRule.Default("length", Map.of("max", 255)),
        new ValidationRule.Default("person-name-prohibited-characters", Map.of())
      };

  String KEYCLOAK_VALUE_REF_TEMPLATE = "${%s}";

  String getKey();

  String getDisplayName();

  Group getGroup();

  boolean isRequired();

  List<ValidationRule> getValidationRules();

  enum Group {
    DEFAULT,
    CUSTOM,
  }

  sealed interface ValidationRule {
    String ruleId();

    Map<String, Object> toMap();

    record Default(String ruleId, Map<String, Object> toMap) implements ValidationRule {}

    record Length(int minLength, int maxLength) implements ValidationRule {
      @Override
      public String ruleId() {
        return "length";
      }

      @Override
      public Map<String, Object> toMap() {
        return Map.of("min", minLength, "max", maxLength);
      }
    }

    record Pattern(String regex) implements ValidationRule {
      @Override
      public String ruleId() {
        return "pattern";
      }

      @Override
      public Map<String, Object> toMap() {
        return Map.of("pattern", regex, "error-message", "");
      }
    }
  }
}
