/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.relay;

import java.nio.ByteBuffer;
import java.util.UUID;

public class UUIDParser {

  private UUIDParser() {
    throw new IllegalStateException("Utility class");
  }

  public static void write(UUID uuid, ByteBuffer buffer) {
    buffer.putLong(uuid.getMostSignificantBits());
    buffer.putLong(uuid.getLeastSignificantBits());
  }

  public static UUID readUUID(ByteBuffer buffer) {
    return new UUID(buffer.getLong(), buffer.getLong());
  }
}
