/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.api.UpdateProceduresBulkResponse;

public class BulkUpdateProceduresStatistics {
  private int numUpdated;
  private int numError;
  private int numUnmodified;

  public void countUpdated() {
    numUpdated++;
  }

  public void countError() {
    numError++;
  }

  public void countUnmodified() {
    numUnmodified++;
  }

  public UpdateProceduresBulkResponse mapToResponse() {
    return new UpdateProceduresBulkResponse(numUpdated, numError, numUnmodified);
  }
}
