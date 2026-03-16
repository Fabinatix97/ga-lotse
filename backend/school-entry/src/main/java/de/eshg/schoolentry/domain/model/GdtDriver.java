/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.lib.gdt.GdtRecord;
import de.eshg.lib.gdt.v21.codec.Gdt21Constants;
import de.eshg.schoolentry.business.model.PersonDetailsData;
import de.eshg.schoolentry.gdt.Gdt21Converter;
import de.eshg.schoolentry.gdt.Gdt21Serializer;
import de.eshg.schoolentry.gdt.GdtConverter;
import de.eshg.schoolentry.gdt.GdtSerializer;
import de.eshg.schoolentry.util.NameAliasGenerator;
import java.nio.charset.Charset;

public enum GdtDriver {
  OSCILLA_AUDIO_CONSOLE(
      Gdt21Constants.CHARSET_ANSI, "AUDI01", new Gdt21Serializer(), new Gdt21Converter());

  private final Charset charset;
  private final String testMethod;

  private final GdtSerializer<? extends GdtRecord> serializer;

  private final GdtConverter<? extends GdtRecord> converter;

  GdtDriver(
      Charset charset,
      String testMethod,
      GdtSerializer<? extends GdtRecord> serializer,
      GdtConverter<? extends GdtRecord> converter) {
    this.charset = charset;
    this.testMethod = testMethod;
    this.serializer = serializer;
    this.converter = converter;
  }

  public String getTestMethod() {
    return testMethod;
  }

  public Charset getCharset() {
    return charset;
  }

  @SuppressWarnings("unchecked")
  public <T extends GdtRecord> byte[] serialize(T gdtRecord) {
    return ((GdtSerializer<T>) serializer).serialize(gdtRecord, charset);
  }

  public GdtRecord domainToGdt(
      String equipmentSelector,
      String correlationId,
      PersonDetailsData child,
      NameAliasGenerator.NameAlias nameAlias) {
    return converter.domainToGdt(this, equipmentSelector, correlationId, child, nameAlias);
  }
}
