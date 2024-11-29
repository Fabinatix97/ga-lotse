/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.TestInstance;

/**
 * Marker annotation that is used for {@link org.junit.jupiter.api.Nested} test classes which tells
 * the test framework (i.e. {@link BaseSpringTest}) to skip the reset before each test.
 *
 * <p>This annotation is primarily used to improve performance in scenarios where resetting the test
 * environment before each test is expensive and unnecessary, particularly for read-only tests that
 * do not modify shared state between test methods.
 *
 * <p>{@link TestInstance.Lifecycle#PER_CLASS} is required to allow the use of non-static
 * {@code @BeforeAll} methods, enabling a one-time reset at the beginning of all tests instead of
 * before each test method.
 *
 * <p>It is important to ensure that tests do not alter shared state, as skipping resets can
 * otherwise lead to state leakage and unpredictable results between tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public @interface SkipResetsBeforeEachTest {}
