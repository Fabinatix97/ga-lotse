/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.concern;

import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
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
    String concernEn =
        yaml.get("concern_en") != null ? String.valueOf(yaml.get("concern_en")) : null;
    AppointmentTypeDto appointmentType =
        yaml.get("appointment_type") != null
            ? AppointmentTypeDto.valueOf(String.valueOf(yaml.get("appointment_type")))
            : null;
    boolean visibleInOnlinePortal = Boolean.TRUE.equals(yaml.get("online_portal_visibility"));
    if (visibleInOnlinePortal && (concernEn == null || appointmentType == null)) {
      throw new RuntimeException(
          "An english concern name and appointment type must be specified when visible in online portal");
    }
    return new ConcernConfigDto(
        String.valueOf(yaml.get("concern_de")),
        concernEn,
        Boolean.TRUE.equals(yaml.get("high_priority")),
        appointmentType,
        visibleInOnlinePortal);
  }

  public static ConcernDto mapToConcernDto(Concern concern) {
    if (concern == null) {
      return null;
    }
    return new ConcernDto(
        concern.getVersion(),
        concern.getNameDe(),
        concern.getNameEn(),
        concern.isHighPriority(),
        concern.getCategoryNameDe(),
        concern.getCategoryNameEn(),
        concern.getAppointmentType() != null
            ? AppointmentTypeMapper.toInterfaceType(concern.getAppointmentType())
            : null,
        concern.isVisibleInOnlinePortal());
  }

  public static Concern mapToEntity(ConcernDto concernDto) {
    Concern concern = new Concern();
    mapOntoExistingEntity(concernDto, concern);
    return concern;
  }

  public static void mapOntoExistingEntity(ConcernDto concernDto, Concern concern) {
    concern.setNameDe(concernDto.nameDe());
    concern.setNameEn(concernDto.nameEn());
    concern.setHighPriority(concernDto.highPriority());
    concern.setCategoryNameDe(concernDto.categoryNameDe());
    concern.setCategoryNameEn(concernDto.categoryNameEn());
    concern.setAppointmentType(
        concernDto.appointmentType() != null
            ? AppointmentTypeMapper.toDomainType(concernDto.appointmentType())
            : null);
    concern.setVisibleInOnlinePortal(concernDto.visibleInOnlinePortal());
  }

  public static ConcernDto mapConcernConfigToConcernDto(
      ConcernConfigDto concernConfigDto,
      ConcernCategoryConfigDto concernCategoryConfigDto,
      long version) {
    return new ConcernDto(
        version,
        concernConfigDto.nameDe(),
        concernConfigDto.nameEn(),
        concernConfigDto.highPriority(),
        concernCategoryConfigDto.nameDe(),
        concernCategoryConfigDto.nameEn(),
        concernConfigDto.appointmentType(),
        concernConfigDto.visibleInOnlinePortal());
  }
}
