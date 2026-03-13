/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.sample.api.AutocompleteParameterDto;
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
import de.eshg.inspection.sample.api.InspectionSampleMeasurementParameterTemplateDto;
import de.eshg.inspection.sample.api.InspectionSamplePreclassificationDto;
import de.eshg.inspection.sample.api.InspectionSampleTemplateDto;
import de.eshg.inspection.sample.api.InspectionSampleTypeDto;
import de.eshg.inspection.sample.api.InspectionSampleUserDto;
import de.eshg.inspection.sample.api.InspectionSampleUserReferenceDto;
import de.eshg.inspection.sample.api.UntersuchungsparameterReferenceDto;
import de.eshg.inspection.sample.persistence.InspectionSample;
import de.eshg.inspection.sample.persistence.InspectionSampleActorReference;
import de.eshg.inspection.sample.persistence.InspectionSampleActorReferenceType;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameter;
import de.eshg.inspection.sample.persistence.InspectionSampleMeasurementParameterTemplate;
import de.eshg.inspection.sample.persistence.InspectionSampleTemplate;
import de.eshg.inspection.samplingpoint.api.InspectionSamplingPointDto;
import de.eshg.inspection.teis.persistence.TeisEinheit;
import de.eshg.inspection.teis.persistence.TeisParameter;
import de.eshg.inspection.teis.persistence.TeisParameterRepository;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameter;
import de.eshg.inspection.teis.persistence.TeisUntersuchungsparameterRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class InspectionSampleMapper {

  private final TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository;
  private final TeisParameterRepository teisParameterRepository;

  public InspectionSampleMapper(
      TeisUntersuchungsparameterRepository teisUntersuchungsparameterRepository,
      TeisParameterRepository teisParameterRepository) {
    this.teisUntersuchungsparameterRepository = teisUntersuchungsparameterRepository;
    this.teisParameterRepository = teisParameterRepository;
  }

  public static InspectionSampleDto mapToDto(
      InspectionSample sample,
      GetFacilityFileStateResponse facilityFileState,
      GetSamplingPointFileStateResponse samplingPointFileState,
      Map<UUID, UserDto> userMap,
      Map<UUID, ContactDto> contactMap) {
    return mapToDto(
        sample,
        facilityFileState,
        new InspectionSamplingPointDto(
            samplingPointFileState.id(),
            samplingPointFileState.zid(),
            samplingPointFileState.name()),
        userMap,
        contactMap);
  }

  public static InspectionSampleDto mapToDto(
      InspectionSample sample,
      GetFacilityFileStateResponse facilityFileState,
      InspectionSamplingPointDto samplingPointFileState,
      Map<UUID, UserDto> userMap,
      Map<UUID, ContactDto> contactMap) {

    return new InspectionSampleDto(
        sample.getInspection().getExternalId(),
        sample.getSampleExternalId(),
        InspectionSampleTypeDto.valueOf(sample.getTypeOfSample().name()),
        samplingPointFileState,
        sample.getSampleNumber(),
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
        measurementParameter.getTeisParameter().getBezeichnung(),
        measurementParameter.getParameterGroup(),
        measurementParameter.getMeasurementValue(),
        Optional.ofNullable(
                Optional.ofNullable(measurementParameter.getTeisParameter().getEinheit())
                    .orElse(
                        Optional.ofNullable(measurementParameter.getTeisUntersuchungsparameter())
                            .map(TeisUntersuchungsparameter::getEinheit)
                            .orElse(null)))
            .map(TeisEinheit::getKurzbezeichnung)
            .orElse(null),
        measurementParameter.getPreclassification() != null
            ? InspectionSamplePreclassificationDto.valueOf(
                measurementParameter.getPreclassification().name())
            : InspectionSamplePreclassificationDto.PENDING,
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

  public InspectionSampleMeasurementParameter mapToPersistenceObject(
      CreateInspectionSampleMeasurementParameterRequest measurementParameterDto) {
    InspectionSampleMeasurementParameter measurementParameter =
        new InspectionSampleMeasurementParameter();
    measurementParameter.setMeasurementParameterExternalId(measurementParameterDto.externalId());
    measurementParameter.setTeisParameter(
        teisParameterRepository
            .findTeisParameterByZid(measurementParameterDto.parameterZid())
            .orElseThrow(
                () ->
                    new RuntimeException(
                        "No Parameter found for ZID " + measurementParameterDto.parameterZid())));
    if (measurementParameterDto.untersuchungsparameterZid() != null) {
      measurementParameter.setTeisUntersuchungsparameter(
          teisUntersuchungsparameterRepository
              .findTeisUntersuchungsparameterByZid(
                  measurementParameterDto.untersuchungsparameterZid())
              .orElseThrow(
                  () ->
                      new RuntimeException(
                          "No Untersuchungsparameter found for ZID "
                              + measurementParameterDto.untersuchungsparameterZid())));
      if (!Objects.equals(
          measurementParameter.getTeisUntersuchungsparameter().getParameter().getZid(),
          measurementParameter.getTeisParameter().getZid())) {
        throw new BadRequestException(
            ErrorCode.BAD_REQUEST, "Untersuchungsparameter and Parameter don't match");
      }
    }
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

  public static AutocompleteParameterDto mapToUntersuchungsParameterReferenceDto(
      TeisParameter parameter) {
    String zid = parameter.getZid();
    String name = parameter.getBezeichnung();
    return new AutocompleteParameterDto(zid, name);
  }

  public static UntersuchungsparameterReferenceDto mapToUntersuchungsParameterReferenceDto(
      TeisUntersuchungsparameter untersuchungsparameter) {
    String zid = untersuchungsparameter.getZid();
    String name = untersuchungsparameter.getUntersuchungsumfang().getKurzbezeichnung();
    if (untersuchungsparameter.getGrenzwertText() != null) {
      name += " (" + untersuchungsparameter.getGrenzwertText() + ")";
    } else {
      if (untersuchungsparameter.getObgrenzwert() != null
          && untersuchungsparameter.getUntgrenzwert() != null) {
        name +=
            " ("
                + untersuchungsparameter.getUntgrenzwert()
                + " - "
                + untersuchungsparameter.getObgrenzwert()
                + ")";
      } else if (untersuchungsparameter.getObgrenzwert() != null) {
        name += " (≤" + untersuchungsparameter.getObgrenzwert() + ")";
      } else if (untersuchungsparameter.getUntgrenzwert() != null) {
        name += " (≥" + untersuchungsparameter.getUntgrenzwert() + ")";
      }
    }
    return new UntersuchungsparameterReferenceDto(zid, name);
  }

  public static InspectionSampleTemplateDto mapToDto(InspectionSampleTemplate sampleTemplate) {
    return new InspectionSampleTemplateDto(
        sampleTemplate.getExternalId(),
        sampleTemplate.getName(),
        InspectionSampleEvaluationTypeDto.valueOf(sampleTemplate.getEvaluationType().name()),
        InspectionSampleTypeDto.valueOf(sampleTemplate.getTypeOfSample().name()),
        sampleTemplate.getMeasurementParameters().stream()
            .map(InspectionSampleMapper::mapToDto)
            .toList());
  }

  public static InspectionSampleMeasurementParameterTemplateDto mapToDto(
      InspectionSampleMeasurementParameterTemplate measurementParameterTemplate) {
    return new InspectionSampleMeasurementParameterTemplateDto(
        measurementParameterTemplate.getTeisParameter().getBezeichnung(),
        measurementParameterTemplate.getTeisParameter().getZid(),
        Optional.ofNullable(measurementParameterTemplate.getTeisUntersuchungsparameter())
            .map(TeisUntersuchungsparameter::getZid)
            .orElse(null),
        measurementParameterTemplate.getParameterGroup());
  }
}
