/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
