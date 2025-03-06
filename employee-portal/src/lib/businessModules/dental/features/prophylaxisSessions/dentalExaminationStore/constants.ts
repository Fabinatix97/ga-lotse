/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDentitionType, ApiTooth } from "@eshg/dental-api";

import { NavigateDirection } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/actions/navigate";

import { QuadrantNumber, ToothType } from "./types";

export const QUADRANT_NUMBERS: QuadrantNumber[] = ["Q1", "Q2", "Q3", "Q4"];

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

export const WISDOM_TEETH = new Set<ApiTooth>(["T18", "T28", "T38", "T48"]);

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

export const INITIALLY_TOGGLED_OPTIONAL_TEETH: Record<
  ApiDentitionType,
  Set<ApiTooth>
> = {
  PRIMARY: new Set<ApiTooth>([]),
  MIXED: new Set<ApiTooth>(["T16", "T26", "T36", "T46"]),
  SECONDARY: OPTIONAL_TEETH,
};

export const NAVIGATE_DIRECTIONS: Record<string, NavigateDirection> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};
