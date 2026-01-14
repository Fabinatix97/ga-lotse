/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.gdpr;

import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.domain.model.serialization.ZipFileWrapper;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class InspectionGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  public InspectionGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  public ZipEditor createSpecificFilter() {
    return ZipEditor.makePostProcessor(this::filterFiles);
  }

  private void filterFiles(ZipFileWrapper zipFile) {
    Set<String> fileNames = Set.copyOf(zipFile.getFileNames());
    for (String fileName : fileNames) {
      if (isNotReportPdf(fileName)) {
        zipFile.removeEntry(fileName);
      }
    }
  }

  private static boolean isNotReportPdf(String fileName) {
    return !fileName.startsWith("Begehungsprotokoll-") || !fileName.endsWith(".pdf");
  }
}
