/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.statistics;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.measlesprotection.persistence.db.AccessRestriction;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.measlesprotection.persistence.db.SubmissionResult;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class MeaslesProtectionProcedureDataSource
    extends ProcedureDataSource<MeaslesProtectionProcedure, MeaslesProtectionProcedureAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("86e379d1-6fed-4d18-992a-a20476ef24d1");
  public static final String DATA_SOURCE_NAME = "Masernschutz";

  public MeaslesProtectionProcedureDataSource(
      MeaslesProtectionProcedureRepository procedureRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        procedureRepository,
        MeaslesProtectionProcedureAttributes.values());
  }

  @Override
  protected Object mapSpecificValue(
      MeaslesProtectionProcedure procedure,
      MeaslesProtectionProcedureAttributes attribute,
      TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case PERSON_CENTRAL_FILE_ID -> procedure.getPatientIdFromCentralFile();
      case FACILITY_CENTRAL_FILE_ID -> procedure.getFacilityIdFromCentralFile();
      case REPORTING_DATE -> procedure.getReportData().reportingDate();
      case REPORTING_REASON ->
          procedure.getReportData().reportingReason() == null
              ? null
              : procedure.getReportData().reportingReason().getGermanName();
      case CURRENT_ACCESS_RESTRICTION ->
          accessRestrictionIsInEffect(procedure.getAccessRestriction());
      case TERMINATED_ACCESS_RESTRICTION ->
          accessRestrictionIsTerminated(procedure.getAccessRestriction());
      case VALID_PROOF_SUBMISSION ->
          procedure.getProofSubmissions().stream()
              .anyMatch(
                  proofSubmission ->
                      SubmissionResult.PROOF_SUBMITTED.equals(
                          proofSubmission.getSubmissionResult()));
      case PERMANENT_CONTRA_INDICATION ->
          procedure.getProofSubmissions().stream()
              .anyMatch(
                  proofSubmission ->
                      SubmissionResult.MEDICAL_ATTEST.equals(
                          proofSubmission.getSubmissionResult()));
    };
  }

  private boolean accessRestrictionIsInEffect(AccessRestriction accessRestriction) {
    if (accessRestriction == null) {
      return false;
    }
    return accessRestriction.getRestrictionIssuedDate() != null
        && accessRestriction.getRestrictionTerminationDate() == null;
  }

  private boolean accessRestrictionIsTerminated(AccessRestriction accessRestriction) {
    if (accessRestriction == null) {
      return false;
    }
    return accessRestriction.getRestrictionIssuedDate() != null
        && accessRestriction.getRestrictionTerminationDate() != null;
  }
}
