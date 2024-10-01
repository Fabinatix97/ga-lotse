/*
 * Copyright 2024 cronn GmbH
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
@Profile(ConditionalOnLocalEnvironment.LOCAL_PROFILE_NAME)
public @interface ConditionalOnLocalEnvironment {
  String LOCAL_PROFILE_NAME = "local";
}
