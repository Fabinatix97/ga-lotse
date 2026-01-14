/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.model;

import static de.eshg.dental.domain.model.ToothType.PRIMARY;
import static de.eshg.dental.domain.model.ToothType.SECONDARY;
import static de.eshg.dental.domain.model.ToothType.WISDOM;

public enum Tooth {
  T11(SECONDARY),
  T12(SECONDARY),
  T13(SECONDARY),
  T14(SECONDARY),
  T15(SECONDARY),
  T16(SECONDARY),
  T17(SECONDARY),
  T18(WISDOM),

  T21(SECONDARY),
  T22(SECONDARY),
  T23(SECONDARY),
  T24(SECONDARY),
  T25(SECONDARY),
  T26(SECONDARY),
  T27(SECONDARY),
  T28(WISDOM),

  T31(SECONDARY),
  T32(SECONDARY),
  T33(SECONDARY),
  T34(SECONDARY),
  T35(SECONDARY),
  T36(SECONDARY),
  T37(SECONDARY),
  T38(WISDOM),

  T41(SECONDARY),
  T42(SECONDARY),
  T43(SECONDARY),
  T44(SECONDARY),
  T45(SECONDARY),
  T46(SECONDARY),
  T47(SECONDARY),
  T48(WISDOM),

  T51(PRIMARY),
  T52(PRIMARY),
  T53(PRIMARY),
  T54(PRIMARY),
  T55(PRIMARY),

  T61(PRIMARY),
  T62(PRIMARY),
  T63(PRIMARY),
  T64(PRIMARY),
  T65(PRIMARY),

  T71(PRIMARY),
  T72(PRIMARY),
  T73(PRIMARY),
  T74(PRIMARY),
  T75(PRIMARY),

  T81(PRIMARY),
  T82(PRIMARY),
  T83(PRIMARY),
  T84(PRIMARY),
  T85(PRIMARY);

  private final ToothType type;

  Tooth(ToothType type) {
    this.type = type;
  }

  public boolean isPrimaryTooth() {
    return this.type == PRIMARY;
  }

  public boolean isSecondaryTooth() {
    return this.type == SECONDARY;
  }

  public boolean isWisdomTooth() {
    return this.type == WISDOM;
  }
}
