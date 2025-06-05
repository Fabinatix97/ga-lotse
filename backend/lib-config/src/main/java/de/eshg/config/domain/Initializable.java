/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

public interface Initializable {
  void setInitialized(boolean initialized);

  boolean isInitialized();
}
