/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import static java.util.Locale.ROOT;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class StringUtil {

  private StringUtil() {}

  private static final Logger log = LoggerFactory.getLogger(StringUtil.class);

  public static String prepareStringForPrefixLike(String s, boolean withPerc) {
    return (s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_").toLowerCase(ROOT))
        + (withPerc ? "%" : "");
  }
}
