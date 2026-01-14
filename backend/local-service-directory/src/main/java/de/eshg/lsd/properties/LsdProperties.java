/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * @param maxCertificatesPerActor The maximum number of certificates that are retained per actor.
 *     This should be configured to two times the maximum number of replicas per actor.
 */
@ConfigurationProperties(prefix = "eshg.lsd")
public record LsdProperties(@DefaultValue("2") int maxCertificatesPerActor) {}
