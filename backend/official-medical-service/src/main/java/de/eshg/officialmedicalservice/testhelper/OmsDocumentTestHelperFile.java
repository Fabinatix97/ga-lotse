/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import org.springframework.web.multipart.MultipartFile;

public class OmsDocumentTestHelperFile implements MultipartFile {
  private final String name;
  private final String contentType;
  private final File file;

  public OmsDocumentTestHelperFile(String name, String contentType, File file) {
    this.name = name;
    this.contentType = contentType;
    this.file = file;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getOriginalFilename() {
    return file.getName();
  }

  @Override
  public String getContentType() {
    return contentType;
  }

  @Override
  public boolean isEmpty() {
    return file.length() == 0;
  }

  @Override
  public long getSize() {
    return file.length();
  }

  @Override
  public byte[] getBytes() throws IOException {
    return Files.readAllBytes(file.toPath());
  }

  @Override
  public InputStream getInputStream() throws IOException {
    return new FileInputStream(file);
  }

  @Override
  public void transferTo(File dest) throws IOException, IllegalStateException {
    Files.copy(file.toPath(), dest.toPath());
  }
}
