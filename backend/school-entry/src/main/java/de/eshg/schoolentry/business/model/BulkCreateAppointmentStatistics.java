/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.api.CreateAppointmentsBulkResponse;

public class BulkCreateAppointmentStatistics {
  private int numCreated;
  private int numError;
  private int numUnmodified;

  public void countCreated() {
    numCreated++;
  }

  public void countError() {
    numError++;
  }

  public void countUnmodified() {
    numUnmodified++;
  }

  public CreateAppointmentsBulkResponse mapToResponse() {
    return new CreateAppointmentsBulkResponse(numCreated, numError, numUnmodified);
  }
}
