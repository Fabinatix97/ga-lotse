/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.Entity;

@Entity
public class MedicalRegistryEntry
    extends Procedure<MedicalRegistryEntry, MedicalRegistryTask, Person, Facility> {}
