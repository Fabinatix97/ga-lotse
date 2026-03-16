/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.gdt;

import de.eshg.lib.gdt.GdtRecord;
import java.nio.charset.Charset;

public interface GdtSerializer<T extends GdtRecord> {

  byte[] serialize(T gdtRecord, Charset charset);
}
