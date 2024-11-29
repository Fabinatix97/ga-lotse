/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.Tag;

/** Used for "./gradlew test -PschemaOnly" */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Tag(SchemaTest.TAG)
public @interface SchemaTest {
  String TAG = "Schema";
}
