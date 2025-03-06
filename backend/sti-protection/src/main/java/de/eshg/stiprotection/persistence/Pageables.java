/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public final class Pageables {
  private Pageables() {}

  public static <T> Pageable nextOrUnpaged(Slice<T> slice) {
    return slice.hasNext() ? slice.nextPageable() : Pageable.unpaged();
  }
}
