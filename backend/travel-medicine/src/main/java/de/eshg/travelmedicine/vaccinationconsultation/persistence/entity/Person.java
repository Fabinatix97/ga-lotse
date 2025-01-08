/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.Objects;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
@DataSensitivity(SensitivityLevel.PUBLIC)
public class Person extends RelatedPerson<VaccinationConsultation> {

  boolean isPatient() {
    return hasPersonType(PersonType.PATIENT);
  }

  private boolean hasPersonType(PersonType personType) {
    return Objects.equals(personType, getPersonType());
  }
}
