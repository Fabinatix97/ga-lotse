/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.mapper.OpeningHoursMapper.mapToResponse;

import de.eshg.config.api.GetOpeningHoursConfigResponse;
import de.eshg.config.api.OpeningHoursDto;
import de.eshg.config.domain.AbstractOpeningHours;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.i18n.Language;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public abstract class AbstractOpeningHoursController<T extends AbstractOpeningHours> {
  public static final String OPENING_HOURS_API_SUFFIX = "/opening-hours";
  private final AbstractOpeningHoursService<T> openingHoursService;

  protected AbstractOpeningHoursController(AbstractOpeningHoursService<T> openingHoursService) {
    this.openingHoursService = openingHoursService;
  }

  @Transactional(readOnly = true)
  @GetMapping
  public GetOpeningHoursConfigResponse getConfigOpeningHours() {
    return mapToResponse(openingHoursService.getConfig());
  }

  @Transactional
  @PutMapping
  public void updateConfigOpeningHours(@Valid @RequestBody OpeningHoursDto openingHoursDto) {
    if (!openingHoursDto.localizations().containsKey(Language.GERMAN)) {
      throw new BadRequestException("German localization is mandatory.");
    }

    openingHoursDto
        .localizations()
        .forEach(
            (key, value) -> {
              if (value == null) {
                throw new BadRequestException("Invalid input for " + key);
              }
            });

    openingHoursService.updateOpeningHours(openingHoursDto.localizations());
  }
}
