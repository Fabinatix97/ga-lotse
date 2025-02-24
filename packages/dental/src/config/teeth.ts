/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTooth } from "@eshg/dental-api";

/**
 * Defines a mapping from milk teeth to permanent teeth and vice versa
 */
export const RELATED_TEETH: Partial<Record<ApiTooth, ApiTooth>> = {
  T11: "T51",
  T12: "T52",
  T13: "T53",
  T14: "T54",
  T15: "T55",

  T21: "T61",
  T22: "T62",
  T23: "T63",
  T24: "T64",
  T25: "T65",

  T31: "T71",
  T32: "T72",
  T33: "T73",
  T34: "T74",
  T35: "T75",

  T41: "T81",
  T42: "T82",
  T43: "T83",
  T44: "T84",
  T45: "T85",

  T51: "T11",
  T52: "T12",
  T53: "T13",
  T54: "T14",
  T55: "T15",

  T61: "T21",
  T62: "T22",
  T63: "T23",
  T64: "T24",
  T65: "T25",

  T71: "T31",
  T72: "T32",
  T73: "T33",
  T74: "T34",
  T75: "T35",

  T81: "T41",
  T82: "T42",
  T83: "T43",
  T84: "T44",
  T85: "T45",
};
