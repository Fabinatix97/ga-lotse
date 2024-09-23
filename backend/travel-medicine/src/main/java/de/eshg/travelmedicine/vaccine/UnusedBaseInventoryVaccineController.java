/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.vaccine.api.GetInventoryVaccinesWithoutRmbiVaccineResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = UnusedBaseInventoryVaccineController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "UnusedBaseInventoryVaccine")
public class UnusedBaseInventoryVaccineController {
  public static final String BASE_URL =
      BaseUrls.TravelMedicine.UNUSED_BASE_INVENTORY_VACCINE_CONTROLLER;

  private final VaccineService vaccineService;

  public UnusedBaseInventoryVaccineController(VaccineService vaccineService) {
    this.vaccineService = vaccineService;
  }

  @GetMapping()
  @Operation(summary = "Gets all inventory vaccines that are not used by any rmbi vaccine")
  @Transactional(readOnly = true)
  public GetInventoryVaccinesWithoutRmbiVaccineResponse getInventoryVaccinesWithoutRmbiVaccine() {
    return vaccineService.getInventoryVaccinesWithoutRMBIVaccine();
  }
}
