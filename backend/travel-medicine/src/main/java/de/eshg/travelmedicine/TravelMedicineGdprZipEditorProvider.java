/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory_;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep_;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation_;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination_;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VcService_;
import java.util.Iterator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class TravelMedicineGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  public TravelMedicineGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromArray(
            MedicalHistory_.NOTE,
            VaccinationConsultation_.PROCEDURE_STEPS,
            ProcedureStep_.MEDICAL_HISTORY)
        .andThen(
            removeFieldFromNestedArray(
                VcService_.PHYSICIAN,
                VaccinationConsultation_.PROCEDURE_STEPS,
                ProcedureStep_.SERVICES))
        .andThen(
            removeFieldFromNestedArray(
                VcService_.MFA, VaccinationConsultation_.PROCEDURE_STEPS, ProcedureStep_.SERVICES))
        .andThen(
            removeFieldFromNestedArray(
                Vaccination_.BOOKING_ID,
                VaccinationConsultation_.PROCEDURE_STEPS,
                ProcedureStep_.SERVICES));
  }

  protected ZipEditor removeFieldFromNestedArray(
      String fieldName, String arrayFieldName, String secondArrayFieldName) {
    return (procedureNode, zipFile) -> {
      ArrayNode arrayNode = procedureNode.withArray(arrayFieldName);
      for (Iterator<JsonNode> array = arrayNode.elements(); array.hasNext(); ) {
        ArrayNode secondArrayNode = array.next().withArray(secondArrayFieldName);
        for (Iterator<JsonNode> secondArray = secondArrayNode.elements(); secondArray.hasNext(); ) {
          JsonNode element = secondArray.next();
          ((ObjectNode) element).remove(fieldName);
        }
      }
    };
  }
}
