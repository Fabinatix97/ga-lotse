/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

public enum ImportType {
  CITIZEN_LIST(true),
  SCHOOL_LIST(true),
  PAST_PROCEDURE_LIST(false),
  ;

  private final boolean supportsMerge;

  ImportType(boolean supportsMerge) {
    this.supportsMerge = supportsMerge;
  }

  public boolean supportsMerge() {
    return supportsMerge;
  }
}
