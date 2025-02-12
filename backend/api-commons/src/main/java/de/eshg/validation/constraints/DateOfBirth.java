/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.validation.constraints;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = {DateOfBirthValidator.class})
public @interface DateOfBirth {

  String message() default "Age must be between {minAgeInclusive} and {maxAgeInclusive} years";

  int minAgeInclusive() default -1;

  int maxAgeInclusive() default 150;

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
