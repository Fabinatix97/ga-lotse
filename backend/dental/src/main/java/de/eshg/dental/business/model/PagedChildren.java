/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.business.model;

import java.util.List;
import java.util.stream.Stream;

public record PagedChildren(
    List<ChildWithPersonAndContactData> pagedChildren, long totalNumberOfChildren) {
  public Stream<ChildWithPersonAndContactData> stream() {
    return pagedChildren.stream();
  }
}
