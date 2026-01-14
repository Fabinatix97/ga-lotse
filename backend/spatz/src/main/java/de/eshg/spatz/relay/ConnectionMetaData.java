/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import java.nio.ByteBuffer;
import java.util.UUID;

public class ConnectionMetaData {

  private String targetSni;
  private final ByteBuffer readBuffer = ByteBuffer.allocate(4096);
  private final UUID connectionId;

  public ConnectionMetaData(UUID connectionId, String targetSni) {
    this.connectionId = connectionId;
    this.targetSni = targetSni;
  }

  public UUID getConnectionId() {
    return connectionId;
  }

  public String getTargetSni() {
    return targetSni;
  }

  public ByteBuffer getReadBuffer() {
    return readBuffer;
  }

  public void setTargetSni(String targetSni) {
    this.targetSni = targetSni;
  }
}
