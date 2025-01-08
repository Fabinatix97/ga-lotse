/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.Icd10CodeDto;
import de.eshg.schoolentry.api.SearchIcd10CodesResponse;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository;
import de.eshg.schoolentry.domain.repository.Icd10CodeRepository.Icd10FuzzySearchResult;
import de.eshg.schoolentry.mapper.Icd10CodeMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Icd10CodeController.BASE_URL)
@Tag(name = "Icd10Code")
public class Icd10CodeController {

  public static final String BASE_URL = BaseUrls.SchoolEntry.ICD_10_CODE_CONTROLLER;

  private final Icd10CodeRepository icd10CodeRepository;

  public Icd10CodeController(Icd10CodeRepository icd10CodeRepository) {
    this.icd10CodeRepository = icd10CodeRepository;
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(summary = "Search in the ICD-10 catalogue.")
  public SearchIcd10CodesResponse searchIcd10Codes(
      @RequestParam(name = "searchString", required = false, defaultValue = "")
          @Schema(
              description =
                  "Search for a string within the ICD-10 codes, groups and their title. The search supports a fuzzy search mechanism.")
          String searchString,
      @RequestParam(name = "codes", required = false, defaultValue = "") List<String> codes) {

    validateIcd10CodeRequestParams(searchString, codes);
    List<Icd10CodeDto> icd10Codes =
        performSearch(searchString, codes).map(Icd10CodeMapper::mapToDto).toList();

    return new SearchIcd10CodesResponse(icd10Codes);
  }

  private static void validateIcd10CodeRequestParams(String searchString, List<String> codes) {
    if (searchString.isEmpty() && codes.isEmpty()) {
      throw new BadRequestException("No request param for searchString or codes.");
    }
    if (!searchString.isEmpty() && !codes.isEmpty()) {
      throw new BadRequestException(
          "Only one request param of searchString and codes should be set.");
    }
  }

  Stream<Icd10FuzzySearchResult> performSearch(String searchString, List<String> codes) {
    if (!searchString.isEmpty()) {
      if (searchString.isBlank()) {
        return Stream.empty();
      }
      return icd10CodeRepository.fuzzySearch(searchString);
    } else {
      return icd10CodeRepository.findByCode(codes);
    }
  }
}
