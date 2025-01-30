/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import java.time.Instant;

public interface ProphylaxisSessionRequest {
  Instant dateAndTime();

  String groupName();

  ProphylaxisTypeDto type();

  boolean isScreening();

  FluoridationVarnishDto fluoridationVarnish();
}
