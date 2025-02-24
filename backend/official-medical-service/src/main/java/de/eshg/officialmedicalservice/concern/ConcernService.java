/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.concern;

import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernConfigDto;
import de.eshg.officialmedicalservice.procedure.api.GetConcernsResponse;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.Yaml;

@Service
public class ConcernService {

  @Value("${de.eshg.official-medical-service.concerns.config}")
  private Resource concernsResource;

  public GetConcernsResponse getConcerns() {
    try {
      InputStream inputStream = concernsResource.getInputStream();

      Yaml yaml = new Yaml();

      List<Map<String, Object>> list = yaml.load(inputStream);

      return new GetConcernsResponse(ConcernMapper.mapToDto(list));
    } catch (IOException e) {
      throw new BadRequestException(
          ErrorCode.UNEXPECTED_ERROR,
          "Cannot read concerns config file: " + concernsResource.getFilename());
    }
  }

  public GetConcernsResponse getConcernsVisibleInOnlinePortal() {
    List<ConcernCategoryConfigDto> filteredCategories =
        getConcerns().categories().stream()
            .map(
                category ->
                    new ConcernCategoryConfigDto(
                        category.nameDe(),
                        category.nameEn(),
                        category.concerns().stream()
                            .filter(ConcernConfigDto::visibleInOnlinePortal)
                            .toList()))
            .filter( // filter out categories without concerns
                category -> !category.concerns().isEmpty())
            .toList();

    return new GetConcernsResponse(filteredCategories);
  }
}
