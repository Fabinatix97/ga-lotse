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
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestSamplesData;
import de.eshg.stiprotection.persistence.db.medicalhistory.Examination;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkMedicalHistory;
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
    Diagnosis followUpDiagnosis =
        DiagnosisMapper.toDatabaseType(DiagnosisMapper.toInterfaceType(procedure.getDiagnosis()));
    followUpDiagnosis.setResultsCommunicated(false);
    followUpProcedure.setDiagnosis(followUpDiagnosis);
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
      if (laboratoryTestExamination.getHepAData() != null) {
        examinations.setHepA(laboratoryTestExamination.getHepAData().getResult());
        examinations.setHepADate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getHepBData() != null) {
        examinations.setHepB(laboratoryTestExamination.getHepBData().getResult());
        examinations.setHepBDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getHepCData() != null) {
        examinations.setHepC(laboratoryTestExamination.getHepCData().getResult());
        examinations.setHepCDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getHivData() != null) {
        examinations.setHiv(laboratoryTestExamination.getHivData().getResult());
        examinations.setHivDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getSyphilisData() != null) {
        examinations.setSyphilis(laboratoryTestExamination.getSyphilisData().getResult());
        examinations.setSyphilisDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getGonorrheaTestSamples() != null) {
        LaboratoryTestSamplesData gonorrheaTestSamples =
            laboratoryTestExamination.getGonorrheaTestSamples();
        boolean gonorrhea =
            gonorrheaTestSamples.getAnalSampleData().getResult()
                || gonorrheaTestSamples.getOralSampleData().getResult()
                || gonorrheaTestSamples.getUrethralSampleData().getResult();
        examinations.setGonorrhea(gonorrhea);
        examinations.setGonorrheaDate(laboratoryTestExamination.getTestsConductedDate());
      }
      if (laboratoryTestExamination.getChlamydiaTestSamples() != null) {
        LaboratoryTestSamplesData chlamydiaTestSamples =
            laboratoryTestExamination.getChlamydiaTestSamples();
        boolean chlamydia =
            chlamydiaTestSamples.getAnalSampleData().getResult()
                || chlamydiaTestSamples.getOralSampleData().getResult()
                || chlamydiaTestSamples.getUrethralSampleData().getResult();
        examinations.setChlamydia(chlamydia);
        examinations.setChlamydiaDate(laboratoryTestExamination.getTestsConductedDate());
      }
    }
  }
}
