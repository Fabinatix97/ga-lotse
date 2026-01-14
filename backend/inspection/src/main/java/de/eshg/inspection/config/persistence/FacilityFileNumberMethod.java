/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config.persistence;

// Method for calculating file numbers
// - NO_FILE_NUMBERS (default): File numbers are not used
// - INSPECTION_FRANKFURT: File numbers will be created according to the rules of
//    the inspection department of the Frankfurt (Main) health department, where
//    it consists of three segments (not counting the suffix) separated by dashes,
//    where the first segment is the first letter of the street name, the second
//    is the street number in four digits as taken from the street directory, and
//    the third one is the house number. E.g. Breite Gasse 28 becomes B-0491-28.
//    This requires a street directory that includes street numbers.
public enum FacilityFileNumberMethod {
  NO_FILE_NUMBERS,
  INSPECTION_FRANKFURT
}
