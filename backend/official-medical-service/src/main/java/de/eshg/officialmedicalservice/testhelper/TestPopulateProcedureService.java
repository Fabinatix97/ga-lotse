/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import static de.eshg.lib.procedure.model.ProcedureStatusDto.CLOSED;
import static de.eshg.lib.procedure.model.ProcedureStatusDto.OPEN;

import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.concern.ConcernService;
import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureService;
import de.eshg.officialmedicalservice.procedure.api.ConcernDto;
import de.eshg.officialmedicalservice.procedure.api.PatchConcernRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedurePhysicianRequest;
import de.eshg.officialmedicalservice.testhelper.api.AppointmentPopulationDto;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

/*
Entities still to handle:
 - Appointments
    - complete / withdraw
 - Documents	(how to access docs created by concern)
    - Files	(4, 5 Standardfiles im Backend, die via key über API angesprochen werden)
    - State
 - Opinion
    - File
    - State

API Request:
	completeAppointments - List of AppointmentKeys
	additionalDocuments - List DocumentPopulations (documentKey, fachlichen PostRequest)
	uploadedFiles - List Of filePopulation (documentKey, fileKey, uploadedBy (Citizen or Employee))
	documentState? - ListOf DocumentKeys, entweder (documentState, optional reason) oder fachlicher Patch?
	  beobachten, möglicherweise wird state auch von fileActions beeinflusst, ggf. ist es doch einfacher,
	  documents, files und documentState in einem PopulationDto zu handhaben
	medicalOpinion - PopulationDto mit state, fileKey, publishedFlag
	sendInvitation - true or null
	disputeProcedure - true or null

Folgende PopulationKeys werden nicht vom Client gesetzt, sondern sind im BE fixiert:
 - DefaultDocumentDefinitionKey, dito
 - FileKey, ~ 3 Dateien, die im BE abgelegt werden, um in der PopulatorAPI keine Filestreamingzirkus veranstalten zu müssen
   (sollten Dateinamen eine weitergehende Rolle spielen, nur diese dann in FilePopulationDtos aufnehmen)
Vorschlag: Definitionen als EnumDto in API

Workflow
	# create procedure
	# add facility
	# add concern
	# add physician
	# start procedure (using TargetState)
	# create appointments
	# cancel appointments
	# complete appointments
	# send invitation and obtain citizen token
	# create documents
	# obtain UUIDs from default documents
	# upload files to documents as employee
	# upload files to documents as citizen
	# set file states
	# upload file to opinion
	# set opinion state
	# publish opinion
	# close procedure
	# dispute procedure

API Response
	procedureId
	facilityId (wird aktuell nicht verwendet, könnte für SyncTestfälle sinnvoll sein, sollte dann auch mit affectedPerson so gemacht werden)
	appointmentMap - appointmentKey, UUID der Entity
	documentMap - documentKeys, UUID der Entity (beinhaltet auch die Keys der Documents, die über die default Definitionen angelegt wurden)
	ggf. opinionId
	disputeProcedureId
 */

@Service
@ConditionalOnTestHelperEnabled
public class TestPopulateProcedureService {

  private final EmployeeOmsProcedureService employeeOmsProcedureService;
  private final ConcernService concernService;
  private final OmsAppointmentService appointmentService;
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final OmsAppointmentService omsAppointmentService;

  public TestPopulateProcedureService(
      EmployeeOmsProcedureService employeeOmsProcedureService,
      ConcernService concernService,
      OmsAppointmentService appointmentService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      OmsAppointmentService omsAppointmentService) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
    this.concernService = concernService;
    this.appointmentService = appointmentService;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.omsAppointmentService = omsAppointmentService;
  }

  @Transactional
  public PostPopulateProcedureResponse populateProcedure(PostPopulateProcedureRequest request) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          // 0. create blank response data
          UUID procedureId;
          UUID facilityId = null;
          Map<String, UUID> appointmentMap;

          // 1. create procedure
          procedureId =
              employeeOmsProcedureService.createEmployeeProcedure((request.procedureData()));

          // 2. add facility
          if (request.facility() != null) {
            facilityId = employeeOmsProcedureService.addFacility(procedureId, request.facility());
          }

          // 3. add concern
          if (request.concern() != null) {
            ConcernDto concern =
                concernService.getConcerns().categories().stream()
                    .flatMap(
                        category ->
                            category.concerns().stream()
                                .filter(
                                    concernDto ->
                                        concernDto.nameDe().equals(request.concern().getNameDe()))
                                .map(
                                    concernConfigDto ->
                                        ConcernMapper.mapConcernConfigToConcernDto(
                                            concernConfigDto, category, 0))
                                .findFirst()
                                .stream())
                    .findFirst()
                    .orElseThrow();

            employeeOmsProcedureService.updateOmsProcedureConcern(
                procedureId, new PatchConcernRequest(concern));
          }

          // 4. add physicians
          if (request.physician() != null) {
            employeeOmsProcedureService.modifyPhysician(
                procedureId, new PatchEmployeeOmsProcedurePhysicianRequest(request.physician()));
          }

          // 5. start procedure
          if (Arrays.asList(OPEN, CLOSED).contains(request.targetState())) {
            employeeOmsProcedureService.acceptDraftProcedure(procedureId);
          }

          // 6. add appointments
          appointmentMap = addAppointments(procedureId, request.appointments());

          // 7. cancel appointments
          cancelAppointments(request.cancelledAppointments(), appointmentMap);

          // 8. close appointments
          closeAppointments(request.closedAppointments(), appointmentMap);

          // 9. close procedure
          if (Objects.equals(CLOSED, request.targetState())) {
            employeeOmsProcedureService.closeOpenProcedure(procedureId);
          }

          return new PostPopulateProcedureResponse(procedureId, facilityId, appointmentMap);
        });
  }

  private Map<String, UUID> addAppointments(
      UUID procedureId, List<AppointmentPopulationDto> appointmentPopulations) {
    Map<String, UUID> appointmentMap = new LinkedHashMap<>();
    if (appointmentPopulations != null) {
      appointmentPopulations.forEach(
          population -> {
            UUID appointmentId =
                omsAppointmentService.addAppointmentEmployee(procedureId, population.request());
            appointmentMap.put(population.key(), appointmentId);
          });
    }
    return appointmentMap;
  }

  private void cancelAppointments(
      List<String> cancelledAppointmentList, Map<String, UUID> appointmentMap) {
    if (cancelledAppointmentList == null) {
      return;
    }
    cancelledAppointmentList.forEach(
        appointment -> {
          UUID appointmentId =
              Optional.of(appointmentMap.get(appointment))
                  .orElseThrow(() -> new RuntimeException("Unknown appointment key"));
          appointmentService.cancelAppointmentEmployee(appointmentId);
        });
  }

  private void closeAppointments(List<String> appointmentList, Map<String, UUID> appointmentMap) {
    if (appointmentList == null) {
      return;
    }
    appointmentList.forEach(
        appointment -> {
          UUID appointmentId =
              Optional.of(appointmentMap.get(appointment))
                  .orElseThrow(() -> new RuntimeException("Unknown appointment key"));
          appointmentService.closeAppointmentEmployee(appointmentId);
        });
  }
}
