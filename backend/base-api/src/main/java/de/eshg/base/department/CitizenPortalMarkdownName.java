/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

public enum CitizenPortalMarkdownName implements MarkdownName {
  ACCESSIBILITY("barrierefreiheit_buerger"),
  IMPRINT("impressum"),
  PRIVACY("datenschutzerklaerung_buerger"),
  ACKNOWLEDGEMENTS("danksagung");

  private final String fileNameRoot;

  CitizenPortalMarkdownName(String fileNameRoot) {
    this.fileNameRoot = fileNameRoot;
  }

  @Override
  public String fileNameRoot() {
    return fileNameRoot;
  }
}
