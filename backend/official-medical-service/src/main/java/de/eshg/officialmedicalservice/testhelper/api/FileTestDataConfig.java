/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

public enum FileTestDataConfig {
  PDF("testHelperSampleDocument.pdf"),
  JPG("testHelperSampleImage.jpg"),
  PNG("testHelperSampleImage.png");

  String name;

  FileTestDataConfig(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }
}
