/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.concern;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernConfigDto;
import de.eshg.officialmedicalservice.procedure.api.ConcernDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Concern;
import de.eshg.rest.service.i18n.Language;
import java.util.Arrays;
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
                    Arrays.stream(Language.values())
                        .filter(
                            l ->
                                yamlCategory.get(
                                        "category_" + Language.LANGUAGE_TO_LANGUAGE_TAG.get(l))
                                    != null)
                        .collect(
                            StreamUtil.toLinkedHashMap(
                                l -> l,
                                l ->
                                    String.valueOf(
                                        yamlCategory.get(
                                            "category_"
                                                + Language.LANGUAGE_TO_LANGUAGE_TAG.get(l))))),
                    ((List<Map<String, Object>>) (yamlCategory.get("concerns")))
                        .stream().map(ConcernMapper::mapToConcernConfigDto).toList()))
        .toList();
  }

  public static ConcernConfigDto mapToConcernConfigDto(Map<String, Object> yaml) {
    final var concernNames =
        Arrays.stream(Language.values())
            .filter(l -> yaml.get("concern_" + Language.LANGUAGE_TO_LANGUAGE_TAG.get(l)) != null)
            .collect(
                StreamUtil.toLinkedHashMap(
                    l -> l,
                    l ->
                        String.valueOf(
                            yaml.get("concern_" + Language.LANGUAGE_TO_LANGUAGE_TAG.get(l)))));

    AppointmentTypeDto appointmentType =
        yaml.get("appointment_type") != null
            ? AppointmentTypeDto.valueOf(String.valueOf(yaml.get("appointment_type")))
            : null;
    boolean visibleInOnlinePortal = Boolean.TRUE.equals(yaml.get("online_portal_visibility"));
    if (visibleInOnlinePortal
        && (Arrays.stream(Language.values()).allMatch(concernNames::containsKey)
            || appointmentType == null)) {
      throw new RuntimeException(
          "All translations for the concern name and the appointment type must "
              + "be specified when "
              + "visible in online portal");
    }
    return new ConcernConfigDto(
        concernNames,
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
        Arrays.stream(Language.values())
            .filter(l -> concern.getName(l) != null)
            .collect(StreamUtil.toLinkedHashMap(l -> l, concern::getName)),
        concern.isHighPriority(),
        Arrays.stream(Language.values())
            .filter(l -> concern.getCategoryName(l) != null)
            .collect(StreamUtil.toLinkedHashMap(l -> l, concern::getCategoryName)),
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
    for (Language language : Language.values()) {
      if (concernDto.names().get(language) != null) {
        concern.setName(language, concernDto.names().get(language));
      }
      if (concernDto.categoryNames().get(language) != null) {
        concern.setCategoryName(language, concernDto.categoryNames().get(language));
      }
    }

    concern.setHighPriority(concernDto.highPriority());
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
        concernConfigDto.names(),
        concernConfigDto.highPriority(),
        concernCategoryConfigDto.names(),
        concernConfigDto.appointmentType(),
        concernConfigDto.visibleInOnlinePortal());
  }
}
