/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProtectionProcedureController.BASE_URL)
@Tag(name = "StatusTransition")
public class StatusTransitionController {

  private final ProcedureStatusUpdater statusUpdater;

  public StatusTransitionController(ProcedureStatusUpdater statusUpdater) {
    this.statusUpdater = statusUpdater;
  }

  @PutMapping("/{procedureId}/close")
  @Operation(summary = "Close measles protection procedure.")
  public ResponseEntity<Void> close(@PathVariable("procedureId") @Valid UUID procedureId) {
    statusUpdater.closeProcedure(procedureId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{procedureId}/reopen")
  @Operation(summary = "Reopen measles protection procedure.")
  public ResponseEntity<Void> reopen(@PathVariable("procedureId") @Valid UUID procedureId) {
    statusUpdater.reopenProcedure(procedureId);
    return ResponseEntity.ok().build();
  }
}
