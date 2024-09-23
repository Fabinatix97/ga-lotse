/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
import de.eshg.travelmedicine.disease.DiseaseService;
import de.eshg.travelmedicine.disease.api.GetDiseasesResponse;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.vaccinationconsultation.VaccinationConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = CitizenPublicController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "CitizenPublic")
public class CitizenPublicController {

  public static final String BASE_URL = BaseUrls.TravelMedicine.CITIZEN_PUBLIC_CONTROLLER;

  private final DiseaseService diseaseService;
  private final AppointmentBlockService appointmentBlockService;
  private final VaccinationConsultationService vaccinationConsultationService;
  private final TravelMedicineFeatureToggle featureToggle;
  private final DepartmentInfoService departmentInfoService;

  public CitizenPublicController(
      DiseaseService diseaseService,
      AppointmentBlockService appointmentBlockService,
      VaccinationConsultationService vaccinationConsultationService,
      TravelMedicineFeatureToggle featureToggle,
      DepartmentInfoService departmentInfoService) {
    this.diseaseService = diseaseService;
    this.appointmentBlockService = appointmentBlockService;
    this.vaccinationConsultationService = vaccinationConsultationService;
    this.featureToggle = featureToggle;
    this.departmentInfoService = departmentInfoService;
  }

  @GetMapping("/diseases")
  @Operation(summary = "Gets all public Diseases")
  @Transactional(readOnly = true)
  public GetDiseasesResponse getPublicDiseases() {
    return diseaseService.getPublicDiseases();
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping("/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "appointmentType") AppointmentTypeDto appointmentType,
      @RequestParam(name = "earliestDate", required = false) Instant earliestDate) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    List<AppointmentDto> appointments =
        appointmentBlockService.getFreeAppointments(
            earliestDate, null, MappingUtil.mapEnum(AppointmentType.class, appointmentType), null);

    return new GetFreeAppointmentsResponse(appointments);
  }

  @PostMapping("/vaccination-consultations")
  @Operation(summary = "Save a new vaccination consultation")
  @Transactional
  public UUID postVaccinationConsultationForCitizen(
      @RequestBody @Valid
          PostCitizenVaccinationConsultationRequest postCitizenVaccinationConsultationRequest) {
    featureToggle.assertNewFeatureIsEnabled(TravelMedicineFeature.CITIZEN_PORTAL_PROCEDURE);
    return vaccinationConsultationService.createProcedure(
        postCitizenVaccinationConsultationRequest);
  }

  @Operation(summary = "Get department info.")
  @GetMapping("/department-info")
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfoService.getDepartmentInfo();
  }
}
