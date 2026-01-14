/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.statistics;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.OtherService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.Vaccination;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultation;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationConsultationRepository;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class VaccinationConsultationDataSource
    extends ProcedureDataSource<VaccinationConsultation, VaccinationConsultationAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("6267f96f-8baf-44e8-bbba-70fa57e78ed2");
  public static final String DATA_SOURCE_NAME = "Vorgänge";

  public VaccinationConsultationDataSource(VaccinationConsultationRepository procedureRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        procedureRepository,
        VaccinationConsultationAttributes.values());
  }

  @Override
  protected Object mapSpecificValue(
      VaccinationConsultation procedure,
      VaccinationConsultationAttributes attribute,
      TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case PERSON_CENTRAL_FILE_ID -> procedure.getPatientIdsFromCentralFile().getFirst();
      case NUMBER_OF_APPOINTMENTS -> procedure.getProcedureSteps().size();
      case NUMBER_OF_VACCINATIONS ->
          procedure.getVcServices().stream().filter(Vaccination.class::isInstance).count();
      case NUMBER_OF_OTHER_SERVICES ->
          procedure.getVcServices().stream().filter(OtherService.class::isInstance).count();
      case TRAVEL_DESTINATIONS -> getTravelDestinationsString(procedure);
      case NUMBER_OF_TRAVEL_DESTINATIONS -> procedure.getTravelDestinations().size();
      case TRAVEL_TYPE -> procedure.getTravelType().toString();
      case TRAVEL_TIME_IN_DAYS -> getTravelTimeInDays(procedure);
    };
  }

  private String getTravelDestinationsString(VaccinationConsultation procedure) {
    return procedure.getTravelDestinations().stream()
        .map(CountryCode::getCountryName)
        .sorted()
        .collect(Collectors.joining(", "));
  }

  private Integer getTravelTimeInDays(VaccinationConsultation procedure) {
    if (procedure.getTravelTimeUnit() == null || procedure.getTravelTimeAmount() == null) {
      return null;
    }
    return switch (procedure.getTravelTimeUnit()) {
      case DAYS -> procedure.getTravelTimeAmount();
      case WEEKS -> procedure.getTravelTimeAmount() * 7;
      case MONTHS -> procedure.getTravelTimeAmount() * 30;
      case YEARS -> procedure.getTravelTimeAmount() * 360;
    };
  }
}
