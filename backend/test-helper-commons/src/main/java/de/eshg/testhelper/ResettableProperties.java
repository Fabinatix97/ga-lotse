/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

/**
 * Marker interface for beans that can be reset.
 *
 * <p>Used by the test helper to identify and inject beans that should be reset during testing.
 * Implementing this interface indicates that a bean should participate in the reset process.
 *
 * <p>This interface is typically implemented by two kinds of beans:
 *
 * <ul>
 *   <li><b>Feature Toggles:</b> Properties that are temporary in nature and intended to be removed
 *       after a certain period or when a feature is fully rolled out.
 *   <li><b>Configuration Properties:</b> Properties that are more permanent, intended to persist
 *       for the lifetime of the module.
 * </ul>
 */
public interface ResettableProperties {
  // Marker interface, no methods to implement
}
