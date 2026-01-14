/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.service;

import java.util.LinkedHashSet;

/** synchronized partial wrapper around LinkedHashSet */
public class HeartBeats {
  private final LinkedHashSet<String> linkedSet;

  public HeartBeats() {
    linkedSet = new LinkedHashSet<>();
  }

  void add(String location) {
    synchronized (this) {
      linkedSet.addLast(location);
    }
  }

  String removeEldestEntry() {
    synchronized (this) {
      return linkedSet.removeFirst();
    }
  }

  boolean contains(String location) {
    synchronized (this) {
      return linkedSet.contains(location);
    }
  }
}
