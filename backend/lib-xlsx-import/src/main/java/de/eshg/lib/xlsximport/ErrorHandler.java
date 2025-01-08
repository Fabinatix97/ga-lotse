/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import org.apache.poi.ss.usermodel.Cell;

@FunctionalInterface
public interface ErrorHandler {
  void handleError(Cell cell, String errorMessage);
}
