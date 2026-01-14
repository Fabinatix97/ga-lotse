/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model;

public interface HasFileContent {
  byte[] getContent();

  String getFileName();
}
