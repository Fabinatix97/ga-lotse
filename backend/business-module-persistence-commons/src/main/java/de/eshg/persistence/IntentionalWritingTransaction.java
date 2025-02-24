/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation is used for documentation purposes and is also leveraged in compliance tests.
 * Applying this annotation to a GET endpoint explicitly indicates that it participates in a WRITING
 * transaction.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface IntentionalWritingTransaction {

  String reason();
}
