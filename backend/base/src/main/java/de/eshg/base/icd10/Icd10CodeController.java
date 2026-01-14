/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10;

import de.eshg.base.icd10.api.FindIcd10CodesRequest;
import de.eshg.base.icd10.api.FindIcd10CodesResponse;
import de.eshg.base.icd10.api.Icd10CodeDto;
import de.eshg.base.icd10.api.SearchIcd10CodesResponse;
import de.eshg.base.icd10.persistence.repository.Icd10CodeRepository;
import de.eshg.base.icd10.persistence.repository.Icd10CodeRepository.Icd10SearchResult;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Icd10Code")
public class Icd10CodeController implements Icd10CodeApi {

  private final Icd10CodeRepository icd10CodeRepository;

  public Icd10CodeController(Icd10CodeRepository icd10CodeRepository) {
    this.icd10CodeRepository = icd10CodeRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public SearchIcd10CodesResponse searchIcd10Codes(String searchString, List<String> codes) {
    validateIcd10CodeRequestParams(searchString, codes);
    List<Icd10CodeDto> icd10Codes =
        performSearch(searchString, codes).map(Icd10CodeMapper::mapToDto).toList();

    return new SearchIcd10CodesResponse(icd10Codes);
  }

  @Override
  @Transactional(readOnly = true)
  public FindIcd10CodesResponse findAllIcd10Codes(FindIcd10CodesRequest request) {
    List<Icd10CodeDto> icd10Codes =
        icd10CodeRepository.findAllCodes(request.codes()).map(Icd10CodeMapper::mapToDto).toList();
    return new FindIcd10CodesResponse(icd10Codes);
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

  Stream<Icd10SearchResult> performSearch(String searchString, List<String> codes) {
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
