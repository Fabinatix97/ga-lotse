/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import de.cronn.commons.lang.StreamUtil;
import java.util.Arrays;
import java.util.NoSuchElementException;

public enum ImportStatus {
  IMPORTED_SUCCESSFULLY("Importiert"),
  MERGED_SUCCESSFULLY("Zusammengeführt"),
  MERGE_FAILED("Fehler beim Zusammenführen"),
  ERROR_INPUT_DATA("Fehler"),
  IMPORTED_PREVIOUSLY("Ignoriert"),
  INVALID_PROCEDURE_ID("Ungültige Vorgangs-ID"),
  DUPLICATE_WITHIN_LIST("Duplikat in der Liste"),
  DUPLICATE_IN_ASSET("Duplikat im Bestand"),
  EXCEPTION("Unbekannter Fehler"),
  ;

  private final String description;

  ImportStatus(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  public static boolean exists(String description) {
    return Arrays.stream(ImportStatus.values())
        .map(ImportStatus::getDescription)
        .anyMatch(s -> s.equals(description));
  }

  public static ImportStatus map(String description) {
    return Arrays.stream(ImportStatus.values())
        .filter(s -> s.getDescription().equals(description))
        .collect(StreamUtil.toSingleElement(() -> new NoSuchElementException()));
  }
}
