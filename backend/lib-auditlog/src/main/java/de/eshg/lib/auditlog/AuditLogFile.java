/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

public class AuditLogFile implements MultipartFile {

  private final String name;
  private final byte[] content;

  public AuditLogFile(String name, byte[] content) {
    Assert.hasLength(name, "Name must not be null or empty.");
    this.name = name;
    Assert.notNull(content, "Content must not be null.");
    this.content = content;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getOriginalFilename() {
    return getName();
  }

  @Override
  public String getContentType() {
    return MediaType.APPLICATION_OCTET_STREAM_VALUE;
  }

  @Override
  public boolean isEmpty() {
    return getSize() == 0;
  }

  @Override
  public long getSize() {
    return content.length;
  }

  @Override
  public byte[] getBytes() throws IOException {
    return content;
  }

  @Override
  public InputStream getInputStream() throws IOException {
    return new ByteArrayInputStream(getBytes());
  }

  @Override
  public void transferTo(File dest) throws IOException, IllegalStateException {
    FileCopyUtils.copy(getBytes(), dest);
  }
}
