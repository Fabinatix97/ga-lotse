/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.history;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record HistoryChange<T>(
    @Schema(description = "Specifies if the value has been changed or not.", example = "true")
        @NotNull
        boolean isChanged,
    @Schema(description = "The new object/value if there had been a change.")
        @Valid
        @JsonInclude(JsonInclude.Include.NON_NULL)
        T newValue) {

  @Valid private static final HistoryChange<?> unchanged = new HistoryChange<>(false, null);

  public static <T> HistoryChange<T> of(T value) {
    return new HistoryChange<>(true, value);
  }

  @SuppressWarnings("unchecked")
  public static <T> HistoryChange<T> newChange(boolean isChanged, T value) {
    return isChanged ? new HistoryChange<>(true, value) : (HistoryChange<T>) unchanged;
  }
}
