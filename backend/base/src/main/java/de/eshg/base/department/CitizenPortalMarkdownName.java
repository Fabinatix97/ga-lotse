/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.eshg.config.i18n.MultiLangFileName;

public enum CitizenPortalMarkdownName implements MarkdownName {
  ACCESSIBILITY("barrierefreiheit_buerger"),
  IMPRINT("impressum"),
  PRIVACY("datenschutzerklaerung_buerger"),
  ACKNOWLEDGEMENTS("danksagung");

  private final MultiLangFileName fileName;

  CitizenPortalMarkdownName(String fileNameRoot) {
    this.fileName = MultiLangFileName.fromFilenameWithLanguageTags(fileNameRoot + ".md");
  }

  @Override
  public MultiLangFileName getFileName() {
    return fileName;
  }
}
