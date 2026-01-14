/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ProphylaxisSessionRequest {
  Instant dateAndTime();

  ProphylaxisTypeDto type();

  DentitionTypeDto dentitionType();

  boolean isScreening();

  FluoridationVarnishDto fluoridationVarnish();

  List<UUID> dentistIds();

  List<UUID> zfaIds();
}
