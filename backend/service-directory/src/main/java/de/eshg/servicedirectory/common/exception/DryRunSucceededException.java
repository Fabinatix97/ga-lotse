/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.common.exception;

import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import java.io.Serial;

public class DryRunSucceededException extends RuntimeException {
  @Serial private static final long serialVersionUID = 0;
  private final transient CommitResponseDto result;

  public DryRunSucceededException(CommitResponseDto result) {
    this.result = result;
  }

  public CommitResponseDto getResult() {
    return result;
  }
}
