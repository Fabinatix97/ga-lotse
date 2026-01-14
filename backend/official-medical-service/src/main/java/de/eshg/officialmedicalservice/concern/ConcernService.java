/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.concern;

import de.eshg.officialmedicalservice.citizenpublic.CitizenPublicProcedureService;
import de.eshg.officialmedicalservice.citizenpublic.api.GetCitizenConcernsResponse;
import de.eshg.officialmedicalservice.config.OmsConfigService;
import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernConfigDto;
import de.eshg.officialmedicalservice.procedure.api.GetConcernsResponse;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.Yaml;

@Service
public class ConcernService {

  private final OmsConfigService omsConfigService;
  private final CitizenPublicProcedureService citizenPublicProcedureService;

  public ConcernService(
      OmsConfigService omsConfigService,
      CitizenPublicProcedureService citizenPublicProcedureService) {
    this.omsConfigService = omsConfigService;
    this.citizenPublicProcedureService = citizenPublicProcedureService;
  }

  public GetConcernsResponse getConcerns() {
    InputStream inputStream =
        new ByteArrayInputStream(omsConfigService.getConfig().getConcerns().getContent());

    List<Map<String, Object>> list = new Yaml().load(inputStream);

    return new GetConcernsResponse(ConcernMapper.mapToDto(list));
  }

  public GetCitizenConcernsResponse getConcernsVisibleInOnlinePortal() {
    GetConcernsResponse concerns = getConcerns();
    List<ConcernCategoryConfigDto> filteredCategories =
        concerns.categories().stream()
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

    return new GetCitizenConcernsResponse(filteredCategories, getSelectConcernInfobox());
  }

  private String getSelectConcernInfobox() {
    byte[] content = citizenPublicProcedureService.getSelectConcernInfobox();
    if (content == null) {
      return null;
    }
    return new String(content, StandardCharsets.UTF_8);
  }
}
