/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.BooleanUtils;

public interface IsFluorideVarnishApplicable {
  Boolean fluorideVarnishApplied();

  @JsonIgnore
  default boolean isFluorideVarnishAppliedOrFalse() {
    return BooleanUtils.isTrue(fluorideVarnishApplied());
  }
}
