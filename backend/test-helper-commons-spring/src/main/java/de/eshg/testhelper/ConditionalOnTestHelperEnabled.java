/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.context.annotation.Profile;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Profile(ConditionalOnTestHelperEnabled.TEST_HELPER_PROFILE_NAME)
public @interface ConditionalOnTestHelperEnabled {
  String TEST_HELPER_PROFILE_NAME = "test-helper";
}
