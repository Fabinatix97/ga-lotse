/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import static de.eshg.base.centralfile.persistence.entity.DataOrigin.EXTERNAL;

import de.eshg.base.centralfile.persistence.entity.SamplingPoint;
import org.apache.commons.lang3.StringUtils;

public class SamplingPointMatcher {

  private SamplingPointMatcher() {}

  public static boolean isSamplingPointMatch(
      SamplingPoint referenceSamplingPoint, SamplingPoint samplingPointFileState) {
    return isSamplingPointMatch(
        referenceSamplingPoint, samplingPointFileState.getName(), samplingPointFileState.getZid());
  }

  public static boolean matchesZid(
      SamplingPoint referenceSamplingPoint, SamplingPoint samplingPointFileState) {
    return StringUtils.equals(referenceSamplingPoint.getZid(), samplingPointFileState.getZid());
  }

  public static boolean isSamplingPointMatch(
      SamplingPoint referenceSamplingPoint, String name, String zid) {
    return StringUtils.equals(referenceSamplingPoint.getName(), name)
        && StringUtils.equals(referenceSamplingPoint.getZid(), zid);
  }

  public static boolean requiresUpdate(
      SamplingPoint referenceSamplingPoint, SamplingPoint referenceSamplingPointUpdate) {
    return referenceSamplingPoint.getDataOrigin() == EXTERNAL
        || !isSamplingPointMatch(referenceSamplingPoint, referenceSamplingPointUpdate)
        || !matchesZid(referenceSamplingPoint, referenceSamplingPointUpdate);
  }
}
