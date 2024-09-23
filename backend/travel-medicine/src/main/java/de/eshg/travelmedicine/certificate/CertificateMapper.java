/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate;

import de.eshg.travelmedicine.certificate.api.CertificateDto;
import de.eshg.travelmedicine.certificate.api.CertificateTypeDto;
import de.eshg.travelmedicine.certificate.persistence.entity.Certificate;
import de.eshg.travelmedicine.certificate.persistence.entity.CertificateType;
import de.eshg.travelmedicine.util.MappingUtil;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;

public class CertificateMapper {

  private CertificateMapper() {}

  public static CertificateDto toInterfaceType(Certificate certificate, UUID pdfCertificateFileId) {
    if (certificate == null) return null;

    Instant appointmentTime = getAppointmentTime(certificate.getProcedureStep());

    UUID progressEntryId = certificate.getProgressEntryId();

    return new CertificateDto(
        certificate.getId(),
        MappingUtil.mapEnum(CertificateTypeDto.class, certificate.getCertificateType()),
        appointmentTime,
        progressEntryId,
        pdfCertificateFileId,
        certificate.getCreatedAt(),
        certificate.getModifiedAt());
  }

  public static Certificate toEntityType(
      CertificateTypeDto type, ProcedureStep procedureStep, UUID progressEntryId) {
    return new Certificate(
        MappingUtil.mapEnum(CertificateType.class, type), procedureStep, progressEntryId);
  }

  private static Instant getAppointmentTime(ProcedureStep procedureStep) {
    if (procedureStep.getUserDefinedAppointment() != null) {
      return procedureStep.getUserDefinedAppointment().getAppointmentStart();
    } else if (procedureStep.getAppointment() != null) {
      return procedureStep.getAppointment().getAppointmentStart();
    } else return procedureStep.getEarliestDate().atStartOfDay().toInstant(ZoneOffset.UTC);
  }
}
