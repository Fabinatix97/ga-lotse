/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

public sealed interface KeyDocumentAware permits SystemProgressEntry, ManualProgressEntry {

  String getKeyDocumentType();

  void setKeyDocumentType(String keyDocumentType);

  Integer getKeyDocumentVersion();

  void setKeyDocumentVersion(Integer keyDocumentVersion);
}
