/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.infectionbriefing")
public class InfectionBriefingProperties {

  @NotNull @Valid private Mail newCertificateAppointmentConfirmationMail;
  @NotNull @Valid private Mail replacementCertificateAppointmentConfirmationMail;
  @NotNull @Valid private Mail cancelNewCertificateAppointmentConfirmationMail;
  @NotNull @Valid private Mail cancelReplacementCertificateAppointmentConfirmationMail;

  public Mail getNewCertificateAppointmentConfirmationMail() {
    return newCertificateAppointmentConfirmationMail;
  }

  public Mail getReplacementCertificateAppointmentConfirmationMail() {
    return replacementCertificateAppointmentConfirmationMail;
  }

  public Mail getCancelNewCertificateAppointmentConfirmationMail() {
    return cancelNewCertificateAppointmentConfirmationMail;
  }

  public Mail getCancelReplacementCertificateAppointmentConfirmationMail() {
    return cancelReplacementCertificateAppointmentConfirmationMail;
  }

  public void setNewCertificateAppointmentConfirmationMail(
      Mail newCertificateAppointmentConfirmationMail) {
    this.newCertificateAppointmentConfirmationMail = newCertificateAppointmentConfirmationMail;
  }

  public void setReplacementCertificateAppointmentConfirmationMail(
      Mail replacementCertificateAppointmentConfirmationMail) {
    this.replacementCertificateAppointmentConfirmationMail =
        replacementCertificateAppointmentConfirmationMail;
  }

  public void setCancelNewCertificateAppointmentConfirmationMail(
      Mail cancelNewCertificateAppointmentConfirmationMail) {
    this.cancelNewCertificateAppointmentConfirmationMail =
        cancelNewCertificateAppointmentConfirmationMail;
  }

  public void setCancelReplacementCertificateAppointmentConfirmationMail(
      Mail cancelReplacementCertificateAppointmentConfirmationMail) {
    this.cancelReplacementCertificateAppointmentConfirmationMail =
        cancelReplacementCertificateAppointmentConfirmationMail;
  }

  public static class Mail {
    @NotBlank private String subject;
    @NotNull private Resource body;

    public String getSubject() {
      return subject;
    }

    public void setSubject(String subject) {
      this.subject = subject;
    }

    public Resource getBody() {
      return body;
    }

    public void setBody(Resource body) {
      this.body = assertIfResourcesReadable(body);
    }

    private static Resource assertIfResourcesReadable(Resource resource) {
      if (!resource.isReadable()) {
        throw new IllegalStateException(
            "Resource %s not readable".formatted(resource.getDescription()));
      }
      try {
        if (StringUtils.isBlank(resource.getContentAsString(Charset.defaultCharset()))) {
          throw new IllegalStateException(
              "Resource %s: Content is blank".formatted(resource.getDescription()));
        }
      } catch (IOException e) {
        throw new UncheckedIOException(
            "Error during validation of resource %s".formatted(resource.getDescription()), e);
      }
      return resource;
    }
  }
}
