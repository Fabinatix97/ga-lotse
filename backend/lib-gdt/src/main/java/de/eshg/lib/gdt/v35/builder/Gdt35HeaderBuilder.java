/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.builder;

import java.util.function.Consumer;

/**
 * Builder for the GDT Header (Obj_0033 / Obj_Kopfdaten_GDT).
 *
 * <p>This object is mandatory in every GDT record and contains metadata about the communication
 * partners and the GDT version.
 */
public class Gdt35HeaderBuilder extends BaseBuilder<Gdt35HeaderBuilder> {

  @Override
  protected Gdt35HeaderBuilder self() {
    return this;
  }

  /**
   * Sets the Software Name (0103).
   *
   * @param value The name of the software creating this record (e.g., "MusterPraxisSoftware").
   * @return This builder instance.
   */
  public Gdt35HeaderBuilder software(String value) {
    // Tag 0103 is typically software name, but in 6301 example we saw 0103 used differently?
    // Let's stick to standard 0103 for now.
    return addField("0103", value);
  }

  /**
   * Sets the Software Version (0132).
   *
   * @param value The release status or version of the software (e.g., "3.5.1").
   * @return This builder instance.
   */
  public Gdt35HeaderBuilder version(String value) {
    return addField("0132", value);
  }

  /**
   * Sets the Sender ID (8316).
   *
   * <p>The GDT-ID of the component sending the message. Must match the configured ID in the
   * receiver's settings.
   *
   * @param value The sender's GDT-ID (e.g., "PRAX_AIS").
   * @return This builder instance.
   */
  public Gdt35HeaderBuilder sender(String value) {
    return addField("8316", value);
  }

  /**
   * Sets the Receiver ID (8315).
   *
   * <p>The GDT-ID of the component intended to receive the message.
   *
   * @param value The receiver's GDT-ID (e.g., "LZBD_SYS").
   * @return This builder instance.
   */
  public Gdt35HeaderBuilder receiver(String value) {
    return addField("8315", value);
  }

  /**
   * Adds the Creation Date/Time (8218 / Obj_0054).
   *
   * <p>Mandatory timestamp indicating when the record was created.
   *
   * @param config A consumer to configure the {@link Gdt35TimestampBuilder}.
   * @return This builder instance.
   */
  public Gdt35HeaderBuilder creationDate(Consumer<Gdt35TimestampBuilder> config) {
    return addObject(
        "8218", "Timestamp_Erstellung_Datensatz", "Obj_0054", new Gdt35TimestampBuilder(), config);
  }
}
