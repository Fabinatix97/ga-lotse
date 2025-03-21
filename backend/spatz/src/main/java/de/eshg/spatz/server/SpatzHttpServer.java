/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

public interface SpatzHttpServer {

  void start();

  void stop();

  Integer getListeningPort();
}
