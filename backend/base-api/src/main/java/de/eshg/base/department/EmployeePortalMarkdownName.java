/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

public enum EmployeePortalMarkdownName implements MarkdownName {
  ACCESSIBILITY("barrierefreiheit_mitarbeiter"),
  CONTACT("kontakt_mitarbeiter"),
  PRIVACY("datenschutzerklaerung_mitarbeiter"),
  ACKNOWLEDGEMENTS("danksagung");

  private final String fileNameRoot;

  EmployeePortalMarkdownName(String fileNameRoot) {
    this.fileNameRoot = fileNameRoot;
  }

  @Override
  public String fileNameRoot() {
    return fileNameRoot;
  }
}
