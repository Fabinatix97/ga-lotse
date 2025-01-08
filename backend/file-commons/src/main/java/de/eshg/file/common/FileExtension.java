/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

public enum FileExtension {
  JPG("jpg"),
  JPEG("jpeg"),
  JPE("jpe"),
  JFIF("jfif"),
  PNG("png"),
  PDF("pdf"),
  EML("eml"),
  CSV("csv");

  private final String value;

  FileExtension(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
