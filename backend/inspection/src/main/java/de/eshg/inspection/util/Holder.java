/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

public class Holder<T> {
  private T value;

  public Holder(T value) {
    this.value = value;
  }

  public T set(T value) {
    this.value = value;
    return this.value;
  }

  public T get() {
    return this.value;
  }
}
