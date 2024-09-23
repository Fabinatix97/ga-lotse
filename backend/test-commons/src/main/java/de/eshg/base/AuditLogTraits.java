/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import de.cronn.assertions.validationfile.junit5.JUnit5ValidationFileAssertions;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.eshg.normalization.UuidNormalizer;

public interface AuditLogTraits extends JUnit5ValidationFileAssertions {

  String SUFFIX = "auditlog";

  StaticLogDirExtension auditLogDirExtension();

  default ValidationNormalizer defaultValidationNormalizer() {
    return ValidationNormalizer.combine(new UuidNormalizer());
  }

  default void assertAuditLogContentWithFile() {
    StaticLogDirExtension staticLogDirExtension = auditLogDirExtension();
    assertWithFileWithSuffix(
        dumpContent(staticLogDirExtension), defaultValidationNormalizer(), SUFFIX);
  }

  default void assertAuditLogContentWithFileWithSuffix(String suffix) {
    StaticLogDirExtension staticLogDirExtension = auditLogDirExtension();
    assertWithFileWithSuffix(
        dumpContent(staticLogDirExtension), defaultValidationNormalizer(), SUFFIX + "_" + suffix);
  }

  private String dumpContent(StaticLogDirExtension staticLogDirExtension) {
    return PathUtil.listDirectoryAndFileContent(staticLogDirExtension.toPath());
  }
}
