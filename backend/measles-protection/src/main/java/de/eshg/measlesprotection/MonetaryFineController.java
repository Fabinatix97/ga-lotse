/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.measlesprotection.api.CreateMonetaryFineDto;
import de.eshg.measlesprotection.api.MonetaryFineDto;
import de.eshg.measlesprotection.api.UpdateMonetaryFineDto;
import de.eshg.measlesprotection.mapper.MonetaryFineMapper;
import de.eshg.measlesprotection.persistence.db.MonetaryFine;
import de.eshg.measlesprotection.validation.ProtectedProcedure;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = ProtectionProcedureController.BASE_URL)
@Tag(name = "MonetaryFine")
public class MonetaryFineController {
  private final MonetaryFineService monetaryFineService;

  public MonetaryFineController(MonetaryFineService monetaryFineService) {
    this.monetaryFineService = monetaryFineService;
  }

  @PostMapping("/{id}/monetary-fines")
  @Operation(summary = "Document a monetary fine entry.")
  public MonetaryFineDto createMonetaryFine(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @Valid @RequestBody CreateMonetaryFineDto request) {
    MonetaryFine monetaryFine = monetaryFineService.createMonetaryFine(id, request);
    return MonetaryFineMapper.toInterfaceType(monetaryFine);
  }

  @PatchMapping("/{id}/monetary-fines/{monetaryFineId}")
  @Operation(summary = "Update a monetary fine.")
  public MonetaryFineDto updateMonetaryFine(
      @PathVariable("id") @ProtectedProcedure UUID id,
      @PathVariable("monetaryFineId") UUID monetaryFineId,
      @Valid @RequestBody UpdateMonetaryFineDto request) {
    MonetaryFine monetaryFine = monetaryFineService.updateMonetaryFine(id, monetaryFineId, request);
    return MonetaryFineMapper.toInterfaceType(monetaryFine);
  }
}
