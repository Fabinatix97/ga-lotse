/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import java.time.Instant;
import java.util.UUID;

public interface CentralFileData {
  Long getId();

  UUID getExternalId();

  Instant getDeleteAt();

  DataOrigin getDataOrigin();

  Instant getModifiedAt();

  Long getReferenceVersion();

  Long getVersion();

  CentralFileData getReferenceData();
}
