/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

public enum LocationSelectionMode {
  /**
   * All examinations take place in a single health department. No location selection is necessary.
   */
  NONE,

  /**
   * Examinations take place in multiple health departments. Selection of health departments from
   * the contact management system is required.
   */
  HEALTH_DEPARTMENT,

  /**
   * Examinations take place in the schools. Selection of schools from the contact management system
   * is required.
   */
  SCHOOL
}
