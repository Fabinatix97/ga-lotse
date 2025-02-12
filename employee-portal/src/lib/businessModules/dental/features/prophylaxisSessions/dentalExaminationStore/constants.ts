/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTooth } from "@eshg/dental-api";

import { ToothType } from "./types";

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

export const TOOTH_TYPES: Record<ApiTooth, ToothType> = {
  T11: "SECONDARY_TOOTH",
  T12: "SECONDARY_TOOTH",
  T13: "SECONDARY_TOOTH",
  T14: "SECONDARY_TOOTH",
  T15: "SECONDARY_TOOTH",
  T16: "SECONDARY_TOOTH",
  T17: "SECONDARY_TOOTH",
  T18: "SECONDARY_TOOTH",

  T21: "SECONDARY_TOOTH",
  T22: "SECONDARY_TOOTH",
  T23: "SECONDARY_TOOTH",
  T24: "SECONDARY_TOOTH",
  T25: "SECONDARY_TOOTH",
  T26: "SECONDARY_TOOTH",
  T27: "SECONDARY_TOOTH",
  T28: "SECONDARY_TOOTH",

  T31: "SECONDARY_TOOTH",
  T32: "SECONDARY_TOOTH",
  T33: "SECONDARY_TOOTH",
  T34: "SECONDARY_TOOTH",
  T35: "SECONDARY_TOOTH",
  T36: "SECONDARY_TOOTH",
  T37: "SECONDARY_TOOTH",

  T38: "SECONDARY_TOOTH",
  T41: "SECONDARY_TOOTH",
  T42: "SECONDARY_TOOTH",
  T43: "SECONDARY_TOOTH",
  T44: "SECONDARY_TOOTH",
  T45: "SECONDARY_TOOTH",
  T46: "SECONDARY_TOOTH",
  T47: "SECONDARY_TOOTH",
  T48: "SECONDARY_TOOTH",

  T51: "PRIMARY_TOOTH",
  T52: "PRIMARY_TOOTH",
  T53: "PRIMARY_TOOTH",
  T54: "PRIMARY_TOOTH",
  T55: "PRIMARY_TOOTH",

  T61: "PRIMARY_TOOTH",
  T62: "PRIMARY_TOOTH",
  T63: "PRIMARY_TOOTH",
  T64: "PRIMARY_TOOTH",
  T65: "PRIMARY_TOOTH",

  T71: "PRIMARY_TOOTH",
  T72: "PRIMARY_TOOTH",
  T73: "PRIMARY_TOOTH",
  T74: "PRIMARY_TOOTH",
  T75: "PRIMARY_TOOTH",

  T81: "PRIMARY_TOOTH",
  T82: "PRIMARY_TOOTH",
  T83: "PRIMARY_TOOTH",
  T84: "PRIMARY_TOOTH",
  T85: "PRIMARY_TOOTH",
};

/**
 * Defines teeth which can be added and removed
 */
export const OPTIONAL_TEETH = new Set<ApiTooth>([
  "T16",
  "T17",
  "T18",
  "T26",
  "T27",
  "T28",
  "T36",
  "T37",
  "T38",
  "T46",
  "T47",
  "T48",
]);
