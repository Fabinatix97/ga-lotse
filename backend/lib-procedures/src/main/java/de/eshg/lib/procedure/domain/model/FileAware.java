/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import java.util.UUID;

public interface FileAware {

  UUID getExternalId();

  File getFile();

  void setFile(File file);

  UUID getCreatedBy();

  String getSubject();

  void setSubject(String subject);

  String getMessageText();

  void setMessageText(String messageText);

  boolean supportsUpload(FileType fileType);
}
