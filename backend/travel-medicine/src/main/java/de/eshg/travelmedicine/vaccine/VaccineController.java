/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.vaccine.api.GetVaccinesResponse;
import de.eshg.travelmedicine.vaccine.api.PostPutVaccineRequest;
import de.eshg.travelmedicine.vaccine.api.VaccineDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = VaccineController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Vaccine")
public class VaccineController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.VACCINE_CONTROLLER;

  private final VaccineService vaccineService;

  public VaccineController(VaccineService vaccineService) {
    this.vaccineService = vaccineService;
  }

  @GetMapping
  @Operation(summary = "Gets all Vaccines")
  @Transactional(readOnly = true)
  public GetVaccinesResponse getVaccines() {
    return vaccineService.getVaccines();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Gets one Vaccine by ID")
  @Transactional(readOnly = true)
  public VaccineDto getVaccine(@PathVariable("id") UUID id) {
    return vaccineService.getOneVaccine(id);
  }

  @PostMapping
  @Operation(summary = "Adds a new Vaccine")
  @Transactional
  public VaccineDto postVaccine(@Valid @RequestBody PostPutVaccineRequest request) {
    return vaccineService.addVaccine(request);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Modifies an existing Vaccine")
  @Transactional
  public VaccineDto putVaccine(
      @PathVariable("id") UUID id, @Valid @RequestBody PostPutVaccineRequest request) {
    return vaccineService.modifyVaccine(id, request);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deletes a Vaccine")
  @Transactional
  public void deleteVaccine(@PathVariable("id") UUID id) {
    vaccineService.deleteVaccine(id);
  }
}
