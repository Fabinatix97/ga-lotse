/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface GetDataInformationRequest {

  Instant timeRangeStart();

  Instant timeRangeEnd();

  UUID dataSourceId();

  List<String> attributeCodes();
}
