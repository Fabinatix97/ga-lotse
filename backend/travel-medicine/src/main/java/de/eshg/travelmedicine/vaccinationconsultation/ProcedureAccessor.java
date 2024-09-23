/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.certificate.persistence.entity.Certificate;
import de.eshg.travelmedicine.certificate.persistence.entity.CertificateRepository;
import de.eshg.travelmedicine.medicalhistory.persistence.MedicalHistoryRepository;
import de.eshg.travelmedicine.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.InformationStatementRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStepRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ServiceRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationRepository;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Helper for services, retrieves and validates a vaccination consultation or a procedure step from
 * the resp. repo, and applies additional checks
 */
@Component
public class ProcedureAccessor {

  private final InformationStatementRepository informationStatementRepository;

  public interface ProcedureCheck {
    void applyCheck(VaccinationConsultation vaccinationConsultation) throws BadRequestException;
  }

  // a typical access checker: the procedure must not be closed
  public static class CheckNotClosed implements ProcedureCheck {
    @Override
    public void applyCheck(VaccinationConsultation vaccinationConsultation)
        throws BadRequestException {
      if (vaccinationConsultation.getProcedureStatus() == ProcedureStatus.CLOSED)
        throw new BadRequestException("The procedure (vaccination consultation) is closed.");
    }
  }

  public static class CheckCitizenUserId implements ProcedureCheck {

    private final UUID citizenUserId;

    public CheckCitizenUserId(UUID citizenUserId) {
      this.citizenUserId = citizenUserId;
    }

    @Override
    public void applyCheck(VaccinationConsultation vaccinationConsultation)
        throws BadRequestException {
      if (!citizenUserId.equals(vaccinationConsultation.getCitizenUserId())) {
        throw new BadRequestException("The procedure does not belong to citizenUserId.");
      }
    }
  }

  // frequently used checker series
  public static final List<ProcedureCheck> noChecks = Collections.emptyList();
  public static final List<ProcedureCheck> checkNotClosed = List.of(new CheckNotClosed());

  private final VaccinationConsultationRepository vaccinationConsultationRepository;
  private final ProcedureStepRepository procedureStepRepository;
  private final VaccinationRepository vaccinationRepository;
  private final OtherServiceRepository otherServiceRepository;
  private final ServiceRepository serviceRepository;
  private final MedicalHistoryRepository medicalHistoryRepository;
  private final CertificateRepository certificateRepository;

  public ProcedureAccessor(
      VaccinationConsultationRepository vaccinationConsultationRepository,
      ProcedureStepRepository procedureStepRepository,
      VaccinationRepository vaccinationRepository,
      OtherServiceRepository otherServiceRepository,
      ServiceRepository serviceRepository,
      MedicalHistoryRepository medicalHistoryRepository,
      CertificateRepository certificateRepository,
      InformationStatementRepository informationStatementRepository) {
    this.vaccinationConsultationRepository = vaccinationConsultationRepository;
    this.procedureStepRepository = procedureStepRepository;
    this.vaccinationRepository = vaccinationRepository;
    this.otherServiceRepository = otherServiceRepository;
    this.serviceRepository = serviceRepository;
    this.medicalHistoryRepository = medicalHistoryRepository;
    this.certificateRepository = certificateRepository;
    this.informationStatementRepository = informationStatementRepository;
  }

  /*
  access a procedure: identify the procedure in the vaccination consultation repo, then apply additional checks
  */
  public VaccinationConsultation accessProcedure(
      UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final VaccinationConsultation vaccinationConsultation =
        vaccinationConsultationRepository
            .findByExternalId(procedureId)
            .orElseThrow(
                () -> new NotFoundException("Vaccination consultation not found: " + procedureId));
    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return vaccinationConsultation;
  }

  public VaccinationConsultation accessProcedureByCitizenUserId(
      UUID citizenUserId, List<ProcedureCheck> procedureChecks) {
    final VaccinationConsultation vaccinationConsultation =
        vaccinationConsultationRepository
            .getByCitizenUserId(citizenUserId)
            .orElseThrow(
                () ->
                    new NotFoundException("Vaccination consultation not found for citizenUserId"));
    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return vaccinationConsultation;
  }

  /*
  access a procedure step: identify the procedure step in the procedure step repo, then ensure
  that the step actually belongs to the procedure (if given by its ID), then apply additional
  checks to the procedure (the step itself is not checked)
  */
  public ProcedureStep accessProcedureStep(
      UUID procedureStepId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final ProcedureStep procedureStep =
        procedureStepRepository
            .findById(procedureStepId)
            .orElseThrow(
                () -> new NotFoundException("Procedure step not found: " + procedureStepId));

    VaccinationConsultation vaccinationConsultation = procedureStep.getVaccinationConsultation();

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The procedure step "
                + procedureStepId
                + " is not part of the procedure "
                + procedureId
                + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return procedureStep;
  }

  /*
  access a service: identify the procedure in the procedure repo, then ensure
  that the service actually belongs to the procedure (if given by its ID), then apply
  additional checks to the procedure (the service itself is not checked)
  */
  public VcService accessService(
      UUID serviceId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final VcService service =
        serviceRepository
            .findById(serviceId)
            .orElseThrow(() -> new NotFoundException("Service not found: " + serviceId));

    VaccinationConsultation vaccinationConsultation = service.getVaccinationConsultation();

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The service " + serviceId + " is not part of the procedure " + procedureId + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return service;
  }

  /*
  access a vaccination: identify the procedure in the procedure repo, then ensure
  that the vaccination actually belongs to the procedure (if given by its ID), then apply
  additional checks to the procedure (the vaccination itself is not checked)
  */
  public Vaccination accessVaccination(
      UUID vaccinationId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final Vaccination vaccination =
        vaccinationRepository
            .findById(vaccinationId)
            .orElseThrow(() -> new NotFoundException("Vaccination not found: " + vaccinationId));

    VaccinationConsultation vaccinationConsultation = vaccination.getVaccinationConsultation();

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The vaccination "
                + vaccinationId
                + " is not part of the procedure "
                + procedureId
                + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return vaccination;
  }

  /*
  access an other service: identify the procedure in the procedure repo, then ensure
  that the other service actually belongs to the procedure (if given by its ID), then apply
  additional checks to the procedure (the other service itself is not checked)
  */
  public OtherService accessOtherService(
      UUID otherServiceId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final OtherService otherService =
        otherServiceRepository
            .findById(otherServiceId)
            .orElseThrow(() -> new NotFoundException("Other service not found: " + otherServiceId));

    VaccinationConsultation vaccinationConsultation = otherService.getVaccinationConsultation();

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The other service "
                + otherServiceId
                + " is not part of the procedure "
                + procedureId
                + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return otherService;
  }

  /*
  access a medical history: identify the procedure in the procedure repo, then ensure that the
  medical history actually belongs to the procedure (if given by its ID), then apply
  additional checks to the procedure (the medical history itself is not checked)
  */
  public MedicalHistory accessMedicalHistory(
      UUID medicalHistoryId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final MedicalHistory medicalHistory =
        medicalHistoryRepository
            .findById(medicalHistoryId)
            .orElseThrow(
                () -> new NotFoundException("Medical history not found: " + medicalHistoryId));

    VaccinationConsultation vaccinationConsultation =
        medicalHistoryRepository
            .findProcedureByMedicalHistory(medicalHistoryId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "The medical history "
                            + medicalHistoryId
                            + " doesn't belong to any procedure."));

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The medical history "
                + medicalHistoryId
                + " is not part of the procedure "
                + procedureId
                + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }

    return medicalHistory;
  }

  /*
  access a certificate: identify the procedure in the procedure repo, then ensure
  that the certificate actually belongs to the procedure (if given by its ID), then apply
  additional checks to the procedure (the certificate itself is not checked)
  */
  public Certificate accessCertificate(
      UUID certificateId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final Certificate certificate =
        certificateRepository
            .findById(certificateId)
            .orElseThrow(() -> new NotFoundException("Certificate not found: " + certificateId));

    VaccinationConsultation vaccinationConsultation =
        certificate.getProcedureStep().getVaccinationConsultation();

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The Certificate "
                + certificateId
                + " is not part of the procedure "
                + procedureId
                + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return certificate;
  }

  /*
  access an information statement: identify the procedure in the procedure repo, then ensure
  that the information statement actually belongs to the procedure (if given by its ID), then apply
  additional checks to the procedure (the information statement itself is not checked)
  */
  public InformationStatement accessInformationStatement(
      UUID informationStatementId, UUID procedureId, List<ProcedureCheck> procedureChecks) {
    final InformationStatement informationStatement =
        informationStatementRepository
            .findById(informationStatementId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "InformationStatement not found: " + informationStatementId));

    VaccinationConsultation vaccinationConsultation =
        informationStatement.getVaccinationConsultation();

    if (procedureId != null) {
      if (!vaccinationConsultation.getExternalId().equals(procedureId)) {
        throw new NotFoundException(
            "The Information Statement "
                + informationStatementId
                + " is not part of the procedure "
                + procedureId
                + ".");
      }
    }

    if (procedureChecks != null) {
      procedureChecks.forEach(c -> c.applyCheck(vaccinationConsultation));
    }
    return informationStatement;
  }
}
