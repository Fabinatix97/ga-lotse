/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class FileExtensionEnricher {

  private FileExtensionEnricher() {}

  private static final Pattern FILE_EXTENSION_REGEX_PATTERN =
      Pattern.compile("^.+\\.([A-Za-z0-9]+)$");

  static String enrich(String fileName, ProcedureFileType fileType) {
    if (shouldEnrich(fileName, fileType)) {
      return fileName + "." + fileType.getCommonFileType().getDefaultFileExtension().getValue();
    }

    return fileName;
  }

  private static boolean shouldEnrich(String fileName, ProcedureFileType fileType) {
    Matcher fileExtensionMatcher = getFileExtensionRegexPattern().matcher(fileName);

    return !hasFileExtension(fileExtensionMatcher)
        || !fileType.getCommonFileType().hasValidFileExtension(fileExtensionMatcher.group(1));
  }

  private static boolean hasFileExtension(Matcher fileExtensionMatcher) {
    return fileExtensionMatcher.matches();
  }

  private static Pattern getFileExtensionRegexPattern() {
    return FILE_EXTENSION_REGEX_PATTERN;
  }
}
