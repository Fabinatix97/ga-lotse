/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Articulation")
public record ArticulationDto(
    ArticulationValueDto lettersSAndZPoints,
    ArticulationValueDto formationSchPoints,
    ArticulationValueDto lettersTAndDPoints,
    ArticulationValueDto formationChPoints,
    ArticulationValueDto lettersGAndKPoints,
    ArticulationValueDto lettersLAndNPoints,
    ArticulationValueDto letterRPoints,
    ArticulationValueDto letterFAndFormationPfPoints,
    ArticulationValueDto letterBPoints,
    ArticulationValueDto formationsTrDrKrGrPoints) {
  public ArticulationDto() {
    this(null, null, null, null, null, null, null, null, null, null);
  }
}
