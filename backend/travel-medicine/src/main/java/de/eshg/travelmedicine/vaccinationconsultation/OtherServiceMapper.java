/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.vaccinationconsultation.api.OtherServiceDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import org.springframework.stereotype.Component;

@Component
public class OtherServiceMapper {

  public OtherService toDomainType(
      PostOtherServiceRequest request, VaccinationConsultation vaccinationConsultation) {
    return new OtherService(vaccinationConsultation, request.description(), request.fee());
  }

  public OtherServiceDto toInterfaceType(OtherService otherService) {
    return new OtherServiceDto(
        otherService.getId(),
        otherService.getDescription(),
        otherService.getFee(),
        otherService.getAppliedAt(),
        otherService.getCreatedAt(),
        otherService.getModifiedAt());
  }
}
