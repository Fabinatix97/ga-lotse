/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.business.model;

import de.eshg.dental.api.UpdateBulkResponse;

public class BulkUpdateChildrenStatistics {
  private int numUpdated;
  private int numError;

  public void countUpdated() {
    numUpdated++;
  }

  public void countError() {
    numError++;
  }

  public UpdateBulkResponse mapToResponse() {
    return new UpdateBulkResponse(numUpdated, numError);
  }
}
