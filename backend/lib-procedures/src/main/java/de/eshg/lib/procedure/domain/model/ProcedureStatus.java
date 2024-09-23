/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

public enum ProcedureStatus {
  DRAFT(true),
  OPEN(true),
  IN_PROGRESS(true),
  CLOSED(false),
  ABORTED(false);

  private final boolean open;

  ProcedureStatus(boolean open) {
    this.open = open;
  }

  public boolean isOpen() {
    return open;
  }

  public static boolean isOpen(ProcedureStatus procedureStatus) {
    return procedureStatus != null && procedureStatus.isOpen();
  }

  public static boolean isClosed(ProcedureStatus procedureStatus) {
    return procedureStatus != null && !procedureStatus.isOpen();
  }
}
