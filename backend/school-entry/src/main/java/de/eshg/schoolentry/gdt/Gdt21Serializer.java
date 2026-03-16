/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.gdt;

import de.eshg.lib.gdt.v21.codec.Gdt21Writer;
import de.eshg.lib.gdt.v21.model.Gdt21Record;
import java.io.ByteArrayOutputStream;
import java.nio.charset.Charset;

public class Gdt21Serializer implements GdtSerializer<Gdt21Record> {

  @Override
  public byte[] serialize(Gdt21Record record, Charset charset) {
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    new Gdt21Writer(charset).write(record, out);
    return out.toByteArray();
  }
}
