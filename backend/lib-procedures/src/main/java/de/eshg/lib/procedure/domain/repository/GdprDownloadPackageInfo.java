/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import java.util.UUID;

public interface GdprDownloadPackageInfo {
  UUID getDownloadId();
}
