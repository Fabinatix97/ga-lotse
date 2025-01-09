/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.gdpr;

import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.domain.model.serialization.ZipFileWrapper;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import java.util.Set;
import java.util.function.Predicate;
import org.springframework.stereotype.Component;

@Component
public class InspectionGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  @Override
  public ZipEditor createSpecificFilter() {
    return (jsonNode, zipFile) ->
        filterFiles(zipFile, InspectionGdprZipEditorProvider::isNotReportPdf);
  }

  @Override
  protected String getLegalBasisAppendix() {
    return "Hier könnte Ihr Rechtsgrundlagen-Anhang stehen!";
  }

  private static void filterFiles(ZipFileWrapper zipFile, Predicate<String> predicate) {
    Set<String> fileNames = Set.copyOf(zipFile.getFileNames());
    for (String fileName : fileNames) {
      if (predicate.test(fileName)) {
        zipFile.removeEntry(fileName);
      }
    }
  }

  private static boolean isNotReportPdf(String fileName) {
    return !fileName.startsWith("Begehungsprotokoll-") || !fileName.endsWith(".pdf");
  }
}
