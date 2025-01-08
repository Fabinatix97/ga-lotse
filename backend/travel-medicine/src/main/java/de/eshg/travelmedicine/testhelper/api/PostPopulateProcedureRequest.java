/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.travelmedicine.citizenpublic.api.PostCitizenVaccinationConsultationRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationConsultationRequest;
import jakarta.validation.Valid;
import java.util.List;

public record PostPopulateProcedureRequest(
    @Valid PostVaccinationConsultationRequest procedureData,
    @Valid PostCitizenVaccinationConsultationRequest citizenProcedureData,
    @Valid List<VaccinationPopulationDto> vaccinations,
    @Valid List<OtherServicePopulationDto> otherServices,
    @Valid InitialStepPopulationDto initialStep,
    @Valid List<ProcedureStepPopulationDto> procedureSteps,
    List<String> cancelSteps,
    List<String> executeVaccinations,
    List<String> executeOtherServices,
    @Valid List<CertificatePopulationDto> certificates,
    @Valid List<InformationStatementPopulationDto> informationStatements,
    ProcedureStatusDto targetState) {}
