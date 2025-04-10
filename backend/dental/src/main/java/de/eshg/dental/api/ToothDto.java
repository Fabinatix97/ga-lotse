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

  public boolean isPermanentTooth() {
    return !milkTooth;
  }

  public static boolean isMolar(ToothDto tooth) {
    char secondDigit = tooth.name().charAt(2);
    return secondDigit == '6' || secondDigit == '7' || secondDigit == '8';
  }

  public static ToothDto matchingPermanentToothForMilkTooth(ToothDto tooth) {
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

      case T11,
              T12,
              T13,
              T14,
              T15,
              T16,
              T17,
              T18,
              T21,
              T22,
              T23,
              T24,
              T25,
              T26,
              T27,
              T28,
              T31,
              T32,
              T33,
              T34,
              T35,
              T36,
              T37,
              T38,
              T41,
              T42,
              T43,
              T44,
              T45,
              T46,
              T47,
              T48 ->
          throw new IllegalArgumentException("Unexpected tooth: " + tooth);
    };
  }
}
