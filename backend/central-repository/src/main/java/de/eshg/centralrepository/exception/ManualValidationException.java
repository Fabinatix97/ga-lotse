/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.exception;

import java.io.Serial;
import org.springframework.validation.BindingResult;

public class ManualValidationException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  private final transient BindingResult bindingResult;

  public ManualValidationException(BindingResult bindingResult) {
    this.bindingResult = bindingResult;
  }

  public BindingResult getBindingResult() {
    return bindingResult;
  }
}
