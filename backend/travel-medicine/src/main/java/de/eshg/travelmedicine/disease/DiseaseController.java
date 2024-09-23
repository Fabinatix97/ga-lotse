/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.disease.api.GetDiseasesResponse;
import de.eshg.travelmedicine.disease.api.PostPutDiseaseRequest;
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
@RequestMapping(path = DiseaseController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Disease")
public class DiseaseController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.DISEASE_CONTROLLER;

  private final DiseaseService diseaseService;

  public DiseaseController(DiseaseService diseaseService) {
    this.diseaseService = diseaseService;
  }

  @GetMapping
  @Operation(summary = "Gets all Diseases")
  @Transactional(readOnly = true)
  public GetDiseasesResponse getDiseases() {
    return diseaseService.getDiseases();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Gets one Disease by ID")
  @Transactional(readOnly = true)
  public DiseaseDto getDisease(@PathVariable("id") UUID id) {
    return diseaseService.getDisease(id);
  }

  @PostMapping()
  @Operation(summary = "Adds a new Disease")
  @Transactional
  public DiseaseDto postDisease(@Valid @RequestBody PostPutDiseaseRequest request) {
    return diseaseService.createDisease(request);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Modifies an existing Disease")
  @Transactional
  public DiseaseDto putDisease(
      @PathVariable("id") UUID id, @Valid @RequestBody PostPutDiseaseRequest request) {
    return diseaseService.updateDisease(id, request);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deletes a Disease")
  @Transactional
  public void deleteDisease(@PathVariable("id") UUID id) {
    diseaseService.deleteDisease(id);
  }
}
