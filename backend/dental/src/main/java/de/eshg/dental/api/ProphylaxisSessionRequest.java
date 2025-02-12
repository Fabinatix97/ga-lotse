/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ProphylaxisSessionRequest {
  UUID institutionId();

  Instant dateAndTime();

  String groupName();

  ProphylaxisTypeDto type();

  boolean isScreening();

  FluoridationVarnishDto fluoridationVarnish();

  List<UUID> dentistIds();

  List<UUID> zfaIds();
}
