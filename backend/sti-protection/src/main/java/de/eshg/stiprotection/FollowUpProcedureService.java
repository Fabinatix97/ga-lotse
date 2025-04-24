/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.stiprotection.mapper.consultation.ConsultationMapper;
import de.eshg.stiprotection.mapper.diagnosis.DiagnosisMapper;
import de.eshg.stiprotection.mapper.medicalhistory.MedicalHistoryMapper;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.consultation.Consultation;
import de.eshg.stiprotection.persistence.db.diagnosis.Diagnosis;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination;
import de.eshg.stiprotection.persistence.db.examination.labtests.ChlamydiaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.GonorrheaTest;
import de.eshg.stiprotection.persistence.db.medicalhistory.Examination;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkMedicalHistory;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FollowUpProcedureService {

  private final MedicalHistoryService medicalHistoryService;

  public FollowUpProcedureService(MedicalHistoryService medicalHistoryService) {
    this.medicalHistoryService = medicalHistoryService;
  }

  public void transferFollowUpData(
      StiProtectionProcedure procedure, StiProtectionProcedure followUpProcedure) {
    transferConsultationData(procedure, followUpProcedure);
    transferDiagnosisData(procedure, followUpProcedure);
    transferMedicalHistoryData(procedure, followUpProcedure);
  }

  private void transferConsultationData(
      StiProtectionProcedure procedure, StiProtectionProcedure followUpProcedure) {
    Consultation followUpConsultation =
        ConsultationMapper.update(
            ConsultationMapper.toInterfaceType(procedure.getConsultation()), new Consultation());
    followUpProcedure.setConsultation(followUpConsultation);
  }

  private void transferDiagnosisData(
      StiProtectionProcedure procedure, StiProtectionProcedure followUpProcedure) {
    Diagnosis previousDiagnosis = procedure.getDiagnosis();

    Diagnosis followUpDiagnosis =
        DiagnosisMapper.toDatabaseType(
            DiagnosisMapper.toInterfaceType(previousDiagnosis, List.of()));
    followUpDiagnosis.setIcd10Codes(copyICD10Codes(previousDiagnosis));
    followUpDiagnosis.setResultsCommunicated(false);
    followUpProcedure.setDiagnosis(followUpDiagnosis);
  }

  private static List<String> copyICD10Codes(Diagnosis previousDiagnosis) {
    if (previousDiagnosis == null) {
      return List.of();
    }
    return List.copyOf(previousDiagnosis.getIcd10Codes());
  }

  private void transferMedicalHistoryData(
      StiProtectionProcedure procedure, StiProtectionProcedure followUpProcedure) {
    MedicalHistory medicalHistory = procedure.getMedicalHistory();

    if (medicalHistory != null) {
      MedicalHistory followUpMedicalHistory =
          medicalHistoryService.getOrCreateMedicalHistory(followUpProcedure.getExternalId());

      if (medicalHistory instanceof SexWorkMedicalHistory
          && followUpMedicalHistory instanceof SexWorkMedicalHistory) {
        MedicalHistoryMapper.update(
            MedicalHistoryMapper.toInterfaceType(medicalHistory), followUpMedicalHistory);
      } else {
        MedicalHistoryMapper.updateGeneralMedicalHistory(
            MedicalHistoryMapper.toInterfaceType(medicalHistory), followUpMedicalHistory);
      }

      transferLaboratoryTestDataToMedicalHistory(procedure, followUpProcedure);
    }
  }

  private void transferLaboratoryTestDataToMedicalHistory(
      StiProtectionProcedure procedure, StiProtectionProcedure followUpProcedure) {
    LaboratoryTestExamination laboratoryTestExamination = procedure.getLaboratoryTestExamination();
    Examination examinations = followUpProcedure.getMedicalHistory().getExaminations();

    if (laboratoryTestExamination != null) {
      if (examinations == null) {
        examinations = new Examination();
        followUpProcedure.getMedicalHistory().setExaminations(examinations);
      }
      if (laboratoryTestExamination.getHepAData().isPresent()) {
        examinations.setHepA(laboratoryTestExamination.getHepAData().get().getResult());
        examinations.setHepADate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getHepBData().isPresent()) {
        examinations.setHepB(laboratoryTestExamination.getHepBData().get().getResult());
        examinations.setHepBDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getHepCData().isPresent()) {
        examinations.setHepC(laboratoryTestExamination.getHepCData().get().getResult());
        examinations.setHepCDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getHivData().isPresent()) {
        examinations.setHiv(laboratoryTestExamination.getHivData().get().getResult());
        examinations.setHivDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getSyphilisData().isPresent()) {
        examinations.setSyphilis(laboratoryTestExamination.getSyphilisData().get().getResult());
        examinations.setSyphilisDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getGonorrheaTestSamples().isPresent()) {
        GonorrheaTest gonorrheaTestSamples =
            laboratoryTestExamination.getGonorrheaTestSamples().get();
        examinations.setGonorrhea(gonorrheaTestSamples.getResult());
        examinations.setGonorrheaDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getChlamydiaTestSamples().isPresent()) {
        ChlamydiaTest chlamydiaTestSamples =
            laboratoryTestExamination.getChlamydiaTestSamples().get();
        examinations.setChlamydia(chlamydiaTestSamples.getResult());
        examinations.setChlamydiaDate(laboratoryTestExamination.getTestsConductedDate());
      }
    }
  }
}
