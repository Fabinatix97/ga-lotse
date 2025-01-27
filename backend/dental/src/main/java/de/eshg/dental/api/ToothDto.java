/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Arrays;
import java.util.List;

@Schema(name = "Tooth")
public enum ToothDto {
  T11(false),
  T12(false),
  T13(false),
  T14(false),
  T15(false),
  T16(false),
  T17(false),
  T18(false),

  T21(false),
  T22(false),
  T23(false),
  T24(false),
  T25(false),
  T26(false),
  T27(false),
  T28(false),

  T31(false),
  T32(false),
  T33(false),
  T34(false),
  T35(false),
  T36(false),
  T37(false),
  T38(false),

  T41(false),
  T42(false),
  T43(false),
  T44(false),
  T45(false),
  T46(false),
  T47(false),
  T48(false),

  T51(true),
  T52(true),
  T53(true),
  T54(true),
  T55(true),

  T61(true),
  T62(true),
  T63(true),
  T64(true),
  T65(true),

  T71(true),
  T72(true),
  T73(true),
  T74(true),
  T75(true),

  T81(true),
  T82(true),
  T83(true),
  T84(true),
  T85(true);

  private final boolean milkTooth;

  ToothDto(boolean milkTooth) {
    this.milkTooth = milkTooth;
  }

  public static List<ToothDto> allMilkTeeth() {
    return Arrays.stream(ToothDto.values()).filter(t -> t.milkTooth).toList();
  }

  public static List<ToothDto> allPermanentTeeth() {
    return Arrays.stream(ToothDto.values()).filter(t -> !t.milkTooth).toList();
  }
}
