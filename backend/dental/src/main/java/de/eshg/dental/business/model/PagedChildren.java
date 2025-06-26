/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
