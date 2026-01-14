/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.eshg.config.i18n.MultiLangFileName;

public enum EmployeePortalMarkdownName implements MarkdownName {
  ACCESSIBILITY("barrierefreiheit_mitarbeiter"),
  CONTACT("kontakt_mitarbeiter"),
  PRIVACY("datenschutzerklaerung_mitarbeiter"),
  ACKNOWLEDGEMENTS("danksagung");

  private final MultiLangFileName fileName;

  EmployeePortalMarkdownName(String fileNameRoot) {
    this.fileName = MultiLangFileName.fromFilenameWithLanguageTags(fileNameRoot + ".md");
  }

  @Override
  public MultiLangFileName getFileName() {
    return fileName;
  }
}
