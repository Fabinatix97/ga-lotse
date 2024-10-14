/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import java.util.List;
import java.util.Map;

public interface KeycloakUserAttribute {
  String DEFAULT_ATTRIBUTE_FIRST_NAME = "firstName";
  String DEFAULT_ATTRIBUTE_LAST_NAME = "lastName";
  String DEFAULT_ATTRIBUTE_EMAIL = "email";

  String KEYCLOAK_VALUE_REF_TEMPLATE = "${%s}";

  String getKey();

  String getDisplayName();

  Group getGroup();

  boolean isRequired();

  List<ValidationRule> validationRules();

  enum Group {
    DEFAULT,
    CUSTOM,
  }

  sealed interface ValidationRule {
    String ruleId();

    Map<String, Object> toMap();

    record Length(int minLength, int maxLength) implements ValidationRule {
      @Override
      public String ruleId() {
        return "length";
      }

      @Override
      public Map<String, Object> toMap() {
        return Map.of("min", String.valueOf(minLength), "max", String.valueOf(maxLength));
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
