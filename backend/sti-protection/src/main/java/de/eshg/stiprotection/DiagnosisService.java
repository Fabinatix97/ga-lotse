/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import com.google.common.collect.Sets;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.icd10.Icd10CodeApi;
import de.eshg.base.icd10.api.FindIcd10CodesRequest;
import de.eshg.base.icd10.api.FindIcd10CodesResponse;
import de.eshg.base.icd10.api.Icd10CodeDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.diagnosis.Diagnosis;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class DiagnosisService {
  private final StiProtectionProcedureFinder procedureFinder;
  private final Icd10CodeApi icd10CodeClient;

  public DiagnosisService(
      StiProtectionProcedureFinder procedureFinder, Icd10CodeApi icd10CodeClient) {
    this.procedureFinder = procedureFinder;
    this.icd10CodeClient = icd10CodeClient;
  }

  public Diagnosis getDiagnosis(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return procedure.getDiagnosis();
  }

  public Diagnosis getOrCreateDiagnosis(UUID procedureId) {
    StiProtectionProcedure procedure = procedureFinder.findByExternalId(procedureId);
    return Objects.requireNonNullElseGet(
        procedure.getDiagnosis(),
        () -> {
          Diagnosis diagnosis = new Diagnosis();
          procedure.setDiagnosis(diagnosis);
          return diagnosis;
        });
  }

  public void updateDiagnosis(Diagnosis persistedDiagnosis, Diagnosis newDiagnosis) {
    if (!CollectionUtils.isEmpty(newDiagnosis.getIcd10Codes())) {
      validateIcd10CodesExist(newDiagnosis.getIcd10Codes());
    }
    copyValues(newDiagnosis, persistedDiagnosis);
  }

  private void validateIcd10CodesExist(List<String> icd10Codes) {
    Set<String> missingCodes = validateIcd10Codes(icd10Codes);
    if (!missingCodes.isEmpty()) {
      throw new BadRequestException("ICD-10 codes %s do not exist.".formatted(missingCodes));
    }
  }

  private Set<String> validateIcd10Codes(Collection<String> icd10Codes) {
    if (icd10Codes.isEmpty()) {
      return Set.of();
    }
    FindIcd10CodesResponse validateResponse =
        icd10CodeClient.findAllIcd10Codes(new FindIcd10CodesRequest(new ArrayList<>(icd10Codes)));

    Set<String> existingCodes =
        validateResponse.existingCodes().stream()
            .map(Icd10CodeDto::code)
            .collect(StreamUtil.toLinkedHashSet());

    return Sets.difference(new LinkedHashSet<>(icd10Codes), existingCodes);
  }

  private static void copyValues(Diagnosis fromResult, Diagnosis toResult) {
    toResult.setResults(fromResult.getResults());
    toResult.setMedications(fromResult.getMedications());
    toResult.setIcd10Codes(fromResult.getIcd10Codes());
    toResult.setTestTypes(fromResult.getTestTypes());
    toResult.setOtherTestTypeName(fromResult.getOtherTestTypeName());
    toResult.setGeneralRemarks(fromResult.getGeneralRemarks());
    toResult.setResultsCommunicated(fromResult.getResultsCommunicated());
  }

  public List<Icd10CodeDto> resolveIcd10Codes(Diagnosis diagnosis) {
    if (diagnosis == null || CollectionUtils.isEmpty(diagnosis.getIcd10Codes())) {
      return List.of();
    }
    return icd10CodeClient
        .findAllIcd10Codes(new FindIcd10CodesRequest(diagnosis.getIcd10Codes()))
        .existingCodes();
  }
}
