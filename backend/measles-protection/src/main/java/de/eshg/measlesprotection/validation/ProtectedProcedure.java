/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.validation;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * The annotated element must be a method parameter bound to a URI template variable that identifies
 * a measles protection procedure. The variable must be of type {@code java.util.UUID}. For the
 * validation to be successful, the procedure should have an opened status. The main use case is to
 * deny procedure updates after closing.
 *
 * <p>{@code null} or non-existing procedures are considered valid.
 */
@Target(ElementType.PARAMETER)
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {ProtectedProcedureValidator.class})
public @interface ProtectedProcedure {
  String message() default "Access denied: procedure closed.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
