/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.rest.service.error.BadRequestException;
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
@RequestMapping(value = MeaslesProtectionProcedureController.BASE_URL)
@Tag(name = "StatusTransition")
public class StatusTransitionController {

  private final ProcedureStatusUpdater statusUpdater;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public StatusTransitionController(
      ProcedureStatusUpdater statusUpdater, BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.statusUpdater = statusUpdater;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  @PutMapping("/{procedureId}/close-vaccinated")
  @Operation(
      summary =
          "Closes measles protection procedure draft when a complete vaccination could be found in school-entry")
  public ResponseEntity<Void> closeVaccinated(
      @PathVariable("procedureId") @Valid UUID procedureId) {
    assertVaccinationCheckEnabled();
    statusUpdater.closeVaccinatedProcedure(procedureId);
    return ResponseEntity.ok().build();
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

  private void assertVaccinationCheckEnabled() {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.VACCINATION_CHECK)) {
      throw new BadRequestException("Feature toggle VACCINATION_CHECK not enabled");
    }
  }
}
