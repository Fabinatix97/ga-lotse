/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.relay;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

public class MessageHeader {

  private MessageHeader() {}

  public static void writeHeader(
      ByteBuffer buffer, UUID connectionId, String sourceSni, String targetSni, MessageType type) {
    UUIDParser.write(connectionId, buffer);
    buffer.put((byte) 0);
    buffer.put(sourceSni.getBytes(StandardCharsets.UTF_8));
    buffer.put((byte) 0);
    buffer.put(targetSni.getBytes(StandardCharsets.UTF_8));
    buffer.put((byte) 0);
    buffer.put(type.getByte());
  }
}
