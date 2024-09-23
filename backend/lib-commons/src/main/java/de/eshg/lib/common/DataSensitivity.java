/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Every property of the domain model´s entities should be annotated.
 *
 * <p>If all properties of an entity have the same value for SensitivityLevel, the code may be
 * simplified by annotating the class instead of every single field. Conversely, however, this also
 * means that as soon as a single field has a different value for SensitivityLevel, the class must
 * not be annotated but all fields individually.
 *
 * <p>Context based changes to the DataSensitivity value are not reflected by this annotation E.g.:
 * Day, month or year of a birthdate on their own have SensitivityLevel PSEUDONYMIZED. All of them
 * together as the full birthdate have level PROTECTED. Rules like this are to be enforced during
 * runtime and not via this annotation.
 */
@Target({ElementType.TYPE, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface DataSensitivity {
  SensitivityLevel value();
}
