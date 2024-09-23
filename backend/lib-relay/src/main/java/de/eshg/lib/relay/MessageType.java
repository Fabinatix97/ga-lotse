/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.relay;

public enum MessageType {
  DATA((byte) 0),
  CONNECTION_CLOSED((byte) 1),
  HOST_NOT_ONLINE((byte) 2);

  private final byte b;

  MessageType(byte b) {
    this.b = b;
  }

  public byte getByte() {
    return b;
  }

  public static MessageType ofByte(byte b) {
    for (MessageType value : MessageType.values()) {
      if (value.b == b) {
        return value;
      }
    }
    throw new IllegalArgumentException("unknown MessageType '" + b + "'");
  }
}
