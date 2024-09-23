/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.common;

import java.util.Objects;

public class AdminNameHolder {

  private static final ThreadLocal<String> adminName = new ThreadLocal<>();

  private AdminNameHolder() {}

  public static String getAdminName() {
    return adminName.get();
  }

  public static void setAdminName(String newAdminName) {
    adminName.set(Objects.requireNonNull(newAdminName));
  }

  public static void clearAdminName() {
    adminName.remove();
  }
}
