/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.business.model;

import org.springframework.web.multipart.MultipartFile;

public class DocumentData {
  private final String fileName;
  private final String description;
  private final MultipartFile file;

  public DocumentData(String fileName, String description, MultipartFile file) {
    this.fileName = fileName;
    this.description = description;
    this.file = file;
  }

  public String getFileName() {
    return fileName;
  }

  public String getDescription() {
    return description;
  }

  public MultipartFile getFile() {
    return file;
  }
}
