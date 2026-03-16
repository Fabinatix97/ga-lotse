/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.persistence.entity;

import de.eshg.lib.assessment.domain.model.Assessment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Facility;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsTask;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(indexes = {@Index(columnList = "contact_id"), @Index(columnList = "procedure_id")})
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class MedicalAssessment
    extends Assessment<OmsProcedure, OmsTask, Person, Facility, OmsLegalBasis, OmsSource> {}
