/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.VACCINATION_APPLIED;
import static de.eshg.travelmedicine.util.TravelMedicineProgressEntryType.VACCINATION_EDIT;
import static de.eshg.travelmedicine.util.Validators.validateBatchId;

import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.inventory.api.BookInventoryItemRequest;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.keycloak.TechnicalGroup;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatchVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostOtherServiceRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.ServiceStatusDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.VaccinationTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import de.eshg.travelmedicine.vaccine.persistence.entity.Vaccine;
import de.eshg.travelmedicine.vaccine.persistence.entity.VaccineRepository;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class VcServiceService {

  private static final Logger log = LoggerFactory.getLogger(VcServiceService.class);
  private final VaccinationRepository vaccinationRepository;
  private final VaccinationMapper vaccinationMapper;
  private final OtherServiceRepository otherServiceRepository;
  private final OtherServiceMapper otherServiceMapper;
  private final ServiceRepository serviceRepository;
  private final VaccineRepository vaccineRepository;
  private final InventoryApi inventoryApi;
  private final UserApi userApi;

  public VcServiceService(
      VaccinationRepository vaccinationRepository,
      VaccinationMapper vaccinationMapper,
      OtherServiceRepository otherServiceRepository,
      OtherServiceMapper otherServiceMapper,
      ServiceRepository serviceRepository,
      VaccineRepository vaccineRepository,
      InventoryApi inventoryApi,
      UserApi userApi) {
    this.vaccinationRepository = vaccinationRepository;
    this.vaccinationMapper = vaccinationMapper;
    this.otherServiceRepository = otherServiceRepository;
    this.otherServiceMapper = otherServiceMapper;
    this.serviceRepository = serviceRepository;
    this.vaccineRepository = vaccineRepository;
    this.inventoryApi = inventoryApi;
    this.userApi = userApi;
  }

  public List<Vaccination> createVaccinations(
      VaccinationConsultation vaccinationConsultation,
      List<PostVaccinationRequest> postVaccinationRequests,
      List<Vaccination> collectSeriesFollowUps) {

    List<Vaccination> newVaccinations = new ArrayList<>();
    for (PostVaccinationRequest postVaccinationRequest : postVaccinationRequests) {
      Vaccine vaccine = getVaccine(postVaccinationRequest.vaccineId());

      if (postVaccinationRequest.createSeries()) {
        List<Vaccination> series =
            createSeries(postVaccinationRequest, vaccinationConsultation, vaccine);
        newVaccinations.addAll(series);
        collectSeriesFollowUps.addAll(series.subList(1, series.size()));
      } else {
        newVaccinations.add(
            createVaccination(postVaccinationRequest, vaccinationConsultation, vaccine));
      }
    }
    vaccinationRepository.saveAll(newVaccinations);
    return newVaccinations;
  }

  private List<Vaccination> createSeries(
      PostVaccinationRequest postVaccinationRequest,
      VaccinationConsultation vaccinationConsultation,
      Vaccine vaccine) {
    if (postVaccinationRequest.vaccinationType() == VaccinationTypeDto.BOOSTER) {
      throw new BadRequestException("Cannot create a series for vaccinationType BOOSTER");
    }
    List<Vaccination> vaccinations = new ArrayList<>();
    int sizeOfSeries = vaccine.getOffsets().size() + 1;
    for (int i = 1; i <= sizeOfSeries; i++) {
      PostVaccinationRequest request =
          new PostVaccinationRequest(
              postVaccinationRequest.diseaseId(),
              postVaccinationRequest.vaccineId(),
              postVaccinationRequest.vaccinationType(),
              i,
              false);
      vaccinations.add(createVaccination(request, vaccinationConsultation, vaccine));
    }
    return vaccinations;
  }

  private Vaccination createVaccination(
      PostVaccinationRequest postVaccinationRequest, VaccinationConsultation vc, Vaccine vaccine) {

    if (!vaccine.getDisease().getId().equals(postVaccinationRequest.diseaseId())) {
      throw new BadRequestException("Vaccine does not match Disease");
    }
    return vaccinationMapper.toDomainType(postVaccinationRequest, vaccine, vc);
  }

  public List<OtherService> createOtherServices(
      VaccinationConsultation vaccinationConsultation,
      List<PostOtherServiceRequest> postOtherServiceRequests) {

    List<OtherService> newOtherServices =
        postOtherServiceRequests.stream()
            .map(r -> otherServiceMapper.toDomainType(r, vaccinationConsultation))
            .toList();
    otherServiceRepository.saveAll(newOtherServices);
    return newOtherServices;
  }

  private Vaccine getVaccine(UUID vaccineId) {
    return vaccineRepository
        .findById(vaccineId)
        .orElseThrow(() -> new NotFoundException("Vaccine not found."));
  }

  public void deleteService(VcService service) {

    if (service.isAccomplished()) {
      throw new BadRequestException("Service is already applied and cannot be deleted");
    }
    if (service.isPlanned()) {
      throw new BadRequestException("Service is already planned and cannot be deleted");
    }
    serviceRepository.delete(service);
  }

  public void updateOtherService(
      OtherService otherService, PatchOtherServiceRequest patchOtherServiceRequest) {
    throwExceptionWhenServiceStatusIsOpen(otherService);

    validateMedicalStaff(patchOtherServiceRequest.physician(), patchOtherServiceRequest.mfa());

    if (Objects.equals(patchOtherServiceRequest.appliedAt(), otherService.getAppliedAt())
        && Objects.equals(patchOtherServiceRequest.physician(), otherService.getPhysician())
        && Objects.equals(patchOtherServiceRequest.mfa(), otherService.getMfa())) {
      log.debug("Update for other services has no changes");
      return;
    }

    otherService.setAppliedAt(patchOtherServiceRequest.appliedAt());
    otherService.setPhysician(patchOtherServiceRequest.physician());
    otherService.setMfa(patchOtherServiceRequest.mfa());
  }

  public void updateVaccination(
      Vaccination vaccination, PatchVaccinationRequest patchVaccinationRequest) {

    throwExceptionWhenServiceStatusIsOpen(vaccination);
    validateMedicalStaff(patchVaccinationRequest.physician(), patchVaccinationRequest.mfa());

    if (Objects.equals(patchVaccinationRequest.appliedAt(), vaccination.getAppliedAt())
        && Objects.equals(
            patchVaccinationRequest.batchIdentifier(), vaccination.getBatchIdentifier())
        && Objects.equals(patchVaccinationRequest.physician(), vaccination.getPhysician())
        && Objects.equals(patchVaccinationRequest.mfa(), vaccination.getMfa())
        && vaccination.getBookingId() != null) {
      log.debug("Update for vaccination has no changes and inventory was already booked.");
      return;
    }

    boolean isInventoryAlreadyBooked = vaccination.getBookingId() != null;

    if (!isInventoryAlreadyBooked) {
      bookInventoryItem(vaccination);
    }

    boolean updateVaccination = vaccination.isAccomplished();

    String progressEntryType =
        updateVaccination ? VACCINATION_EDIT.name() : VACCINATION_APPLIED.name();

    vaccination.setAppliedAt(patchVaccinationRequest.appliedAt());
    String batchIdentifier = validateBatchId(patchVaccinationRequest.batchIdentifier());
    vaccination.setBatchIdentifier(batchIdentifier);
    vaccination.setPhysician(patchVaccinationRequest.physician());
    vaccination.setMfa(patchVaccinationRequest.mfa());
    vaccinationRepository.flush();

    addSystemProgressEntry(
        vaccination, updateVaccination, isInventoryAlreadyBooked, progressEntryType);
  }

  private void validateMedicalStaff(UUID physician, UUID mfa) {
    if (physician != null) {
      validateMedicalStaff(physician, TechnicalGroup.TRAVEL_MEDICINE_PHYSICIAN);
    }
    if (mfa != null) {
      validateMedicalStaff(mfa, TechnicalGroup.TRAVEL_MEDICINE_MFA);
    }
  }

  private void validateMedicalStaff(UUID userId, TechnicalGroup group) {
    Set<UUID> groupUserIds =
        userApi.getUsersByGroup(group.getKeycloakName()).users().stream()
            .map(UserDto::userId)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    if (!groupUserIds.contains(userId)) {
      throw new BadRequestException(
          "UserId does not belong to the technical group " + group.name());
    }
  }

  private void addSystemProgressEntry(
      Vaccination vaccination,
      boolean updateVaccination,
      boolean isInventoryAlreadyBooked,
      String progressEntryType) {

    VaccinationConsultation procedure = vaccination.getVaccinationConsultation();

    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            progressEntryType,
            getProgressEntryNote(vaccination, updateVaccination, isInventoryAlreadyBooked),
            TriggerType.SYSTEM_AUTOMATIC);

    procedure.addProgressEntry(progressEntry);
  }

  private String getProgressEntryNote(
      Vaccination vaccination, boolean updateVaccination, boolean isInventoryAlreadyBooked) {
    String date = vaccination.getAppliedAt().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    StringBuilder note = new StringBuilder(updateVaccination ? "Korrektur: " : "");
    note.append(
        String.format(
            "Die %o. Impfung (%s, Impfstoff %s, Chargennummer %s) wurde am %s durchgeführt.",
            vaccination.getVaccinationNumber(),
            vaccination.getDiseaseName(),
            vaccination.getVaccineName(),
            vaccination.getBatchIdentifier(),
            date));

    if (isInventoryAlreadyBooked) {
      return note.toString();
    }
    if (vaccination.getBookingId() == null) {
      return note.append("\n")
          .append(
              String.format(
                  "Abbuchung fehlgeschlagen. Der Bestand für Impfstoff %s konnte nicht aktualisiert werden.",
                  vaccination.getVaccineName()))
          .toString();
    } else {
      return note.append("\n")
          .append(
              String.format(
                  "Abbuchung erfolgreich. Der Bestand für Impfstoff %s wurde erfolgreich aktualisiert.",
                  vaccination.getVaccineName()))
          .toString();
    }
  }

  private void throwExceptionWhenServiceStatusIsOpen(VcService service) {
    if (service.isOpen()) {
      throw new BadRequestException("Service is in state " + ServiceStatusDto.OPEN);
    }
  }

  private void bookInventoryItem(Vaccination vaccination) {

    try {
      UUID inventoryId = vaccination.getInventoryVaccineId();
      Long bookingId =
          inventoryApi.bookInventoryItem(inventoryId, new BookInventoryItemRequest(1)).bookingId();
      vaccination.setBookingId(bookingId);
    } catch (RuntimeException e) {
      log.warn(
          String.format(
              "Booking of inventory item %s failed.", vaccination.getInventoryVaccineId()),
          e);
    }
  }
}
