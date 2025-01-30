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

  public boolean isMilkTooth() {
    return milkTooth;
  }

  public static ToothDto matchingPermanentToothForMilkTooth(ToothDto tooth) {
    if (!tooth.isMilkTooth()) {
      return null;
    }

    return switch (tooth) {
      case T51 -> T11;
      case T52 -> T12;
      case T53 -> T13;
      case T54 -> T14;
      case T55 -> T15;

      case T61 -> T21;
      case T62 -> T22;
      case T63 -> T23;
      case T64 -> T24;
      case T65 -> T25;

      case T71 -> T31;
      case T72 -> T32;
      case T73 -> T33;
      case T74 -> T34;
      case T75 -> T35;

      case T81 -> T41;
      case T82 -> T42;
      case T83 -> T43;
      case T84 -> T44;
      case T85 -> T45;
      default -> null;
    };
  }

  public static ToothDto matchingMilkToothForPermanentTooth(ToothDto tooth) {
    if (tooth.isMilkTooth()) {
      return null;
    }
    return switch (tooth) {
      case T11 -> T51;
      case T12 -> T52;
      case T13 -> T53;
      case T14 -> T54;
      case T15 -> T55;

      case T21 -> T61;
      case T22 -> T62;
      case T23 -> T63;
      case T24 -> T64;
      case T25 -> T65;

      case T31 -> T71;
      case T32 -> T72;
      case T33 -> T73;
      case T34 -> T74;
      case T35 -> T75;

      case T41 -> T81;
      case T42 -> T82;
      case T43 -> T83;
      case T44 -> T84;
      case T45 -> T85;
      default -> null;
    };
  }
}
