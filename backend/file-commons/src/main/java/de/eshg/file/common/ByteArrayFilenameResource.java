/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import org.springframework.core.io.ByteArrayResource;

public class ByteArrayFilenameResource extends ByteArrayResource {

  private final String filename;

  public ByteArrayFilenameResource(String filename, byte[] bytes) {
    super(bytes);
    this.filename = filename;
  }

  @Override
  public String getFilename() {
    return filename;
  }
}
