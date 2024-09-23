/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MailDevReceivedMail(
    String subject,
    String text,
    String html,
    List<MailDevEmailAddress> from,
    List<MailDevEmailAddress> to) {}
