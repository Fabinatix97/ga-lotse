/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
@DataSensitivity(SENSITIVE)
public record ToothDiagnosis(
    @Column(nullable = false) @JdbcType(PostgreSQLEnumJdbcType.class) MainResult mainResult,
    @JdbcType(PostgreSQLEnumJdbcType.class) SecondaryResult secondaryResult1,
    @JdbcType(PostgreSQLEnumJdbcType.class) SecondaryResult secondaryResult2) {}
