/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.staging.persistence.entity;

public enum StagingStatus {
  WORK_IN_PROGRESS,
  READY_FOR_REVIEW;

  public static StagingStatus from(Enum<?> e) {
    return e == null ? null : valueOf(e.name());
  }

  public static <E extends Enum<E>, R extends Enum<R>> R convert(E e, Class<R> toBeConverted) {
    if (e != null) {
      return Enum.valueOf(toBeConverted, e.name());
    } else {
      return null;
    }
  }
}
