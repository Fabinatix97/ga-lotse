/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.concern;

import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernConfigDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Concern;
import java.util.List;
import java.util.Map;

public class ConcernMapper {

  private ConcernMapper() {}

  @SuppressWarnings("unchecked")
  public static List<ConcernCategoryConfigDto> mapToDto(List<Map<String, Object>> yaml) {
    return yaml.stream()
        .map(
            yamlCategory ->
                new ConcernCategoryConfigDto(
                    String.valueOf(yamlCategory.get("category_de")),
                    String.valueOf(yamlCategory.get("category_en")),
                    ((List<Map<String, Object>>) (yamlCategory.get("concerns")))
                        .stream().map(ConcernMapper::mapToConcernConfigDto).toList()))
        .toList();
  }

  public static ConcernConfigDto mapToConcernConfigDto(Map<String, Object> yaml) {
    return new ConcernConfigDto(
        String.valueOf(yaml.get("concern_de")),
        String.valueOf(yaml.get("concern_en")),
        String.valueOf(yaml.get("description_de")),
        String.valueOf(yaml.get("description_en")),
        Boolean.TRUE.equals(yaml.get("high_priority")));
  }

  public static ConcernDto mapToConcernDto(Concern concern) {
    if (concern == null) {
      return null;
    }
    return new ConcernDto(
        concern.getVersion(),
        concern.getNameDe(),
        concern.getNameEn(),
        concern.getDescriptionDe(),
        concern.getDescriptionEn(),
        concern.isHighPriority(),
        concern.getCategoryNameDe(),
        concern.getCategoryNameEn());
  }

  public static Concern mapToEntity(ConcernDto concernDto) {
    Concern concern = new Concern();
    mapOntoExistingEntity(concernDto, concern);
    return concern;
  }

  public static void mapOntoExistingEntity(ConcernDto concernDto, Concern concern) {
    concern.setNameDe(concernDto.nameDe());
    concern.setNameEn(concernDto.nameEn());
    concern.setDescriptionDe(concernDto.descriptionDe());
    concern.setDescriptionEn(concernDto.descriptionEn());
    concern.setHighPriority(concernDto.highPriority());
    concern.setCategoryNameDe(concernDto.categoryNameDe());
    concern.setCategoryNameEn(concernDto.categoryNameEn());
  }

  public static ConcernDto mapConcernConfigToConcernDto(
      ConcernConfigDto concernConfigDto,
      ConcernCategoryConfigDto concernCategoryConfigDto,
      long version) {
    return new ConcernDto(
        version,
        concernConfigDto.nameDe(),
        concernConfigDto.nameEn(),
        concernConfigDto.descriptionDe(),
        concernConfigDto.descriptionEn(),
        concernConfigDto.highPriority(),
        concernCategoryConfigDto.nameDe(),
        concernCategoryConfigDto.nameEn());
  }
}
