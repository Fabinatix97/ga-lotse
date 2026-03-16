/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.gdt;

import de.eshg.lib.gdt.v35.model.Gdt35Record;
import java.nio.charset.Charset;

public class Gdt35Serializer implements GdtSerializer<Gdt35Record> {

  @Override
  public byte[] serialize(Gdt35Record gdtRecord, Charset charset) {
    return new byte[0];
  }
}
