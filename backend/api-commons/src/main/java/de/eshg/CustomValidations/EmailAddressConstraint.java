/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.CustomValidations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.lang.annotation.*;

@Constraint(validatedBy = {})
@Target({ElementType.TYPE_USE, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@NotNull
@Email(
    regexp =
        "^(?=.{6,254})(?!\\.)(?!.*\\.\\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9]+(-+[A-Z0-9]+)*\\.)+[A-Z]{2,}$",
    flags = Pattern.Flag.CASE_INSENSITIVE)
public @interface EmailAddressConstraint {

  String message() default "";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
