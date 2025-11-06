/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.sample.api.CreateInspectionSampleMeasurementParameterRequest;
import de.eshg.inspection.sample.api.InspectionSampleActorDto;
import de.eshg.inspection.sample.api.InspectionSampleActorReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleContactDto;
import de.eshg.inspection.sample.api.InspectionSampleContactReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleDto;
import de.eshg.inspection.sample.api.InspectionSampleEvaluationTypeDto;
import de.eshg.inspection.sample.api.InspectionSampleInspectedFacilityDto;
import de.eshg.inspection.sample.api.InspectionSampleInspectedFacilityReferenceDto;
import de.eshg.inspection.sample.api.InspectionSampleMeasurementParameterDto;
import de.eshg.inspection.sample.api.InspectionSamplePreclassificationDto;
import de.eshg.inspection.sample.api.InspectionSampleTypeDto;
import de.eshg.inspection.sample.api.InspectionSampleUserDto;
import de.eshg.inspection.sample.api.InspectionSampleUserReferenceDto;
import de.eshg.inspection.sample.persistence.InspectionSample;
import de.eshg.inspection.sample.persistence.InspectionSampleActorReference;
import de.eshg.inspection.sample.persistence.InspectionSampleActorReferenceType;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameter;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class InspectionSampleMapper {
  public static InspectionSampleDto mapToDto(
      InspectionSample sample,
      GetFacilityFileStateResponse facilityFileState,
      Map<UUID, UserDto> userMap,
      Map<UUID, ContactDto> contactMap) {

    return new InspectionSampleDto(
        sample.getInspection().getExternalId(),
        sample.getSampleExternalId(),
        InspectionSampleTypeDto.valueOf(sample.getTypeOfSample().name()),
        sample.getPointOfWithdrawal(),
        sample.getNameOfSamplingPoint(),
        InspectionSampleEvaluationTypeDto.valueOf(sample.getEvaluationType().name()),
        mapToDto(sample.getSamplingActor(), facilityFileState, userMap, contactMap),
        sample.getTimeOfSampling(),
        mapToDto(sample.getEvaluatingActor(), facilityFileState, userMap, contactMap),
        sample.getTimeOfEvaluation(),
        sample.getLabel(),
        sample.getCreatedAt(),
        sample.getMeasurementParameters().stream().map(InspectionSampleMapper::mapToDto).toList());
  }

  public static InspectionSampleMeasurementParameterDto mapToDto(
      InspectionSampleMeasurementParameter measurementParameter) {

    return new InspectionSampleMeasurementParameterDto(
        measurementParameter.getMeasurementParameterExternalId(),
        measurementParameter.getParameterName(),
        measurementParameter.getParameterGroup(),
        measurementParameter.getMeasurementValue(),
        "mg/L", // TODO We will need to map this properly when we can
        measurementParameter.getPreclassification() != null
            ? InspectionSamplePreclassificationDto.valueOf(
                measurementParameter.getPreclassification().name())
            : null,
        measurementParameter.getUserAssessment());
  }

  public static InspectionSampleActorDto mapToDto(
      InspectionSampleActorReference actorReference,
      GetFacilityFileStateResponse facilityFileState,
      Map<UUID, UserDto> userMap,
      Map<UUID, ContactDto> contactMap) {
    return switch (actorReference.getType()) {
      case USER -> new InspectionSampleUserDto(userMap.get(actorReference.getReferencedId()));
      case CONTACT ->
          new InspectionSampleContactDto(contactMap.get(actorReference.getReferencedId()));
      case INSPECTED_FACILITY -> new InspectionSampleInspectedFacilityDto(facilityFileState);
    };
  }

  public static InspectionSampleMeasurementParameter mapToPersistenceObject(
      CreateInspectionSampleMeasurementParameterRequest measurementParameterDto) {
    InspectionSampleMeasurementParameter measurementParameter =
        new InspectionSampleMeasurementParameter();
    measurementParameter.setMeasurementParameterExternalId(measurementParameterDto.externalId());
    measurementParameter.setParameterName(measurementParameterDto.parameterName());
    measurementParameter.setParameterGroup(measurementParameterDto.parameterGroup());

    return measurementParameter;
  }

  public static InspectionSampleActorReference mapToPersistenceObject(
      InspectionSampleActorReferenceDto actorReferenceDto) {
    InspectionSampleActorReference actorReference = new InspectionSampleActorReference();
    if (actorReferenceDto instanceof InspectionSampleUserReferenceDto userReferenceDto) {
      actorReference.setType(InspectionSampleActorReferenceType.USER);
      actorReference.setReferencedId(userReferenceDto.userId());
    } else if (actorReferenceDto
        instanceof InspectionSampleContactReferenceDto contactReferenceDto) {
      actorReference.setType(InspectionSampleActorReferenceType.CONTACT);
      actorReference.setReferencedId(contactReferenceDto.contactId());
    } else if (actorReferenceDto instanceof InspectionSampleInspectedFacilityReferenceDto) {
      actorReference.setType(InspectionSampleActorReferenceType.INSPECTED_FACILITY);
    }
    return actorReference;
  }
}
