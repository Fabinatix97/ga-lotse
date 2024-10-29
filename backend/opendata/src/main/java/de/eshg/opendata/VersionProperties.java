/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "version")
public class VersionProperties {
  private String author;

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }
}
