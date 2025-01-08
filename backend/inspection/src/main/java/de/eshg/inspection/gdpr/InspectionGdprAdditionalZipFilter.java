/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.gdpr;

import de.eshg.domain.model.serialization.ZipFileWrapper;
import de.eshg.domain.model.serialization.ZipFilter;
import de.eshg.lib.procedure.gdpr.GdprZipFilterProvider;
import java.util.Set;
import java.util.function.Predicate;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Primary
@Component
public class InspectionGdprAdditionalZipFilter extends GdprZipFilterProvider {

  @Override
  public ZipFilter createSpecificFilter() {
    return (jsonNode, zipFile) ->
        filterFiles(zipFile, InspectionGdprAdditionalZipFilter::isNotReportPdf);
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
