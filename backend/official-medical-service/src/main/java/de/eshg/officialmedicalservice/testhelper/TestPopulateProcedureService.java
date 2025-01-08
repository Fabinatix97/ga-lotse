/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper;

import static de.eshg.lib.procedure.model.ProcedureStatusDto.CLOSED;
import static de.eshg.lib.procedure.model.ProcedureStatusDto.OPEN;

import de.eshg.officialmedicalservice.procedure.EmployeeOmsProcedureService;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureRequest;
import de.eshg.officialmedicalservice.testhelper.api.PostPopulateProcedureResponse;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import jakarta.transaction.Transactional;
import java.util.Arrays;
import java.util.UUID;
import org.springframework.stereotype.Service;

/*
Entities to take handle:
 - Procedure
 - Facility
 - Concern
 - Physician
 - Appointments
    - BookingType (SelfBooking, Appointmentslot, UserDefined)
    - Bookingstate (Open, Booked, Canceled)
    - Completed
 - Documents	(how to access docs created by concern)
    - Files	(4, 5 Standardfiles im Backend, die via key über API angesprochen werden)
    - State
 - Opinion
    - File
    - State
 - TargetState

API Request:
	procedureData - fachlicher POST
	facility - fachlicher POST
	targetState - fachliches Enum, welches im PATCH verwendet wird
	concern - ConcernDefinitionKey
	physician - UUID des Users, Testfällen beziehen diese stabil über Key aus AdministrativePopResponse
	appointments - List of AppointmentPopulations (key, fachlichen PostRequest)
	cancelAppointments - List of AppointmentKeys
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
 - ConcernDefinitionKey, via "test"stabiler application.properties, deutscher Name
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
  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;

  public TestPopulateProcedureService(
      EmployeeOmsProcedureService employeeOmsProcedureService,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper) {
    this.employeeOmsProcedureService = employeeOmsProcedureService;
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
  }

  @Transactional
  public PostPopulateProcedureResponse populateProcedure(PostPopulateProcedureRequest request) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> {
          // 0. create blank response data
          UUID procedureId;
          UUID facilityId = null;

          // 1. create procedure
          procedureId =
              employeeOmsProcedureService.createEmployeeProcedure((request.procedureData()));

          // 2. add facility
          if (request.facility() != null) {
            facilityId = employeeOmsProcedureService.addFacility(procedureId, request.facility());
          }

          // 3. start procedure
          if (Arrays.asList(OPEN).contains(request.targetState())) {
            employeeOmsProcedureService.startProcedure(procedureId);
          }

          // 4. close procedure
          if (Arrays.asList(CLOSED).contains(request.targetState())) {
            employeeOmsProcedureService.closeProcedure(procedureId);
          }

          return new PostPopulateProcedureResponse(procedureId, facilityId);
        });
  }
}
