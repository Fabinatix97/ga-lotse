/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.config;

import static de.eshg.config.ConfigurationEndpoint.HIV_STI_CONSULTATION_APPOINTMENT_STANDARD_DURATION;
import static de.eshg.config.ConfigurationEndpoint.SEX_WORK_APPOINTMENT_STANDARD_DURATION;
import static de.eshg.lib.appointmentblock.persistence.AppointmentType.HIV_STI_CONSULTATION;
import static de.eshg.lib.appointmentblock.persistence.AppointmentType.RESULTS_REVIEW;
import static de.eshg.lib.appointmentblock.persistence.AppointmentType.SEX_WORK;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.ConfigurationStatusAware;
import de.eshg.lib.appointmentblock.AbstractAppointmentStandardDurationService;
import de.eshg.lib.appointmentblock.AppointmentDurationInfo;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.persistence.EntityManager;
import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.SequencedMap;
import org.springframework.stereotype.Service;

@Service
public class StiProtectionAppointmentStandardDurationService
    extends AbstractAppointmentStandardDurationService<StiProtectionAppointmentStandardDuration>
    implements HivStiConsultationConfigurationStatusAware, SexWorkConfigurationStatusAware {

  private static final AppointmentDurationInfo<StiProtectionAppointmentStandardDuration>
      hivStiConsultationInfo =
          AppointmentDurationInfo.of(
              HIV_STI_CONSULTATION,
              StiProtectionAppointmentStandardDuration::getHivStiConsultation,
              StiProtectionAppointmentStandardDuration::setHivStiConsultation);

  private static final AppointmentDurationInfo<StiProtectionAppointmentStandardDuration>
      sexWorkInfo =
          AppointmentDurationInfo.of(
              SEX_WORK,
              StiProtectionAppointmentStandardDuration::getSexWorkConsultation,
              StiProtectionAppointmentStandardDuration::setSexWorkConsultation);

  private static final AppointmentDurationInfo<StiProtectionAppointmentStandardDuration>
      resultsReviewInfo =
          AppointmentDurationInfo.of(
              RESULTS_REVIEW,
              StiProtectionAppointmentStandardDuration::getResultsReview,
              StiProtectionAppointmentStandardDuration::setResultsReview);

  protected StiProtectionAppointmentStandardDurationService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      AppointmentBlockProperties appointmentBlockProperties) {
    super(
        entityManager,
        transactionHelper,
        auditLogWriter,
        appointmentBlockProperties,
        MapUtils.orderedMapOfEntries(
            Map.entry(HIV_STI_CONSULTATION, hivStiConsultationInfo),
            Map.entry(SEX_WORK, sexWorkInfo),
            Map.entry(RESULTS_REVIEW, resultsReviewInfo)),
        StiProtectionAppointmentStandardDuration.class,
        StiProtectionAppointmentStandardDuration::new);
  }

  /**
   * Because of the structure of the sti-protection module, there is no common configuration status
   * for the whole module, but instead there is one configuration status for sex-work related
   * configurations and one for hiv-sti-consultation related configurations. Therefore, this method
   * {@link StiProtectionAppointmentStandardDurationService#getConfigurationStatus} must never be
   * called directly.
   *
   * <p>Instead, the custom configuration services StiConsultationConfigStatusService and
   * SexWorkConfigStatusService take care of fetching the correct status supplier from
   * StiProtectionAppointmentStandardDurationService#getHivStiConsultationConfigurationStatusAware()
   * and StiProtectionAppointmentStandardDurationService#getSexWorkConfigurationStatusAware() in
   * order to make sure that calling StiConsultationConfigStatusService#getConfiguration() will
   * return the hiv-sti-consultation related status information and calling
   * SexWorkConfigStatusService#getConfiguration() will return the sex-work related status
   * information.
   */
  @Override
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {

    throw new UnsupportedOperationException("Unsupported operation.");
  }

  @Override
  public ConfigurationStatusAware getHivStiConsultationConfigurationStatusAware() {
    return () ->
        MapUtils.orderedMapOf(
            HIV_STI_CONSULTATION_APPOINTMENT_STANDARD_DURATION.name(),
            toConfigStatus(getConfig().isHivStiConsultationInitialized()));
  }

  @Override
  public ConfigurationStatusAware getSexWorkConfigurationStatusAware() {
    return () ->
        MapUtils.orderedMapOf(
            SEX_WORK_APPOINTMENT_STANDARD_DURATION.name(),
            toConfigStatus(getConfig().isSexWorkConsultationInitialized()));
  }

  public void updateSexWorkAppointmentStandardDurations(
      Duration resultsReviewAppointmentStandardDuration,
      Duration sexworkAppointmentStandardDuration) {
    validateStandardDurations(
        resultsReviewAppointmentStandardDuration, sexworkAppointmentStandardDuration);
    StiProtectionAppointmentStandardDuration config = getConfig();
    update(
        config,
        FieldUpdate.of(resultsReviewInfo, resultsReviewAppointmentStandardDuration),
        FieldUpdate.of(sexWorkInfo, sexworkAppointmentStandardDuration));
    config.setSexWorkConsultationInitialized(true);
  }

  public void updateHivStiConsultationAppointmentStandardDurations(
      Duration resultsReviewAppointmentStandardDuration,
      Duration hivStiConsultationStandardDuration) {
    validateStandardDurations(
        resultsReviewAppointmentStandardDuration, hivStiConsultationStandardDuration);
    StiProtectionAppointmentStandardDuration config = getConfig();
    update(
        config,
        FieldUpdate.of(resultsReviewInfo, resultsReviewAppointmentStandardDuration),
        FieldUpdate.of(hivStiConsultationInfo, hivStiConsultationStandardDuration));
    config.setHivStiConsultationInitialized(true);
  }

  private void update(
      StiProtectionAppointmentStandardDuration config, FieldUpdate... fieldUpdates) {
    auditLogWriter.writeChangeToAuditLog(
        "appointmentStandardDuration",
        Arrays.stream(fieldUpdates)
            .collect(
                StreamUtil.toLinkedHashMap(
                    FieldUpdate::name,
                    fieldUpdate ->
                        fieldUpdate.fieldInfo().entityGetter().apply(config).toString())),
        Arrays.stream(fieldUpdates)
            .collect(
                StreamUtil.toLinkedHashMap(
                    FieldUpdate::name, fieldUpdate -> fieldUpdate.update().toString())));
    Arrays.stream(fieldUpdates)
        .forEach(
            fieldUpdate -> {
              fieldUpdate.fieldInfo.entitySetter().accept(config, fieldUpdate.update);
            });
  }

  private record FieldUpdate(
      AppointmentDurationInfo<StiProtectionAppointmentStandardDuration> fieldInfo,
      Duration update) {
    private String name() {
      return fieldInfo.name();
    }

    private static FieldUpdate of(
        AppointmentDurationInfo<StiProtectionAppointmentStandardDuration> fieldInfo,
        Duration update) {
      return new FieldUpdate(fieldInfo, update);
    }
  }
}
