/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

function formatCount(
  count: number,
  singularLabel: string,
  pluralLabel: string,
) {
  if (count === 1) {
    return `${count} ${singularLabel}`;
  }

  return `${count} ${pluralLabel}`;
}

export function formatImportedCount(count: number) {
  return formatCount(count, "Vorgang", "Vorgänge");
}

export function formatDuplicatedCount(count: number) {
  return formatCount(count, "doppelter Datensatz", "doppelte Datensätze");
}

export function formatFailedCount(count: number) {
  return formatCount(count, "fehlerhafter Datensatz", "fehlerhafte Datensätze");
}

export function formatTotalCount(count: number) {
  return formatCount(count, "Datensatz", "Datensätze");
}

export function formatIncidentCount(count: number) {
  return formatCount(count, "Vorkommnis", "Vorkommnisse");
}
