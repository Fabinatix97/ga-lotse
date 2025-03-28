/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import java.time.Instant;

public interface TimetableEntry {

  Instant appointmentStart();

  Integer durationInMinutes();
}
