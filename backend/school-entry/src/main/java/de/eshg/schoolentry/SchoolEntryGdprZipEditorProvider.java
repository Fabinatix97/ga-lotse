/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup_;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock_;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment_;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry_;
import de.eshg.lib.procedure.gdpr.AbstractGdprZipEditorProvider;
import de.eshg.schoolentry.domain.model.DevelopmentScreening_;
import de.eshg.schoolentry.domain.model.EyeExaminationResult_;
import de.eshg.schoolentry.domain.model.HearingTestResult_;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure_;
import de.eshg.schoolentry.domain.model.SopessExaminationResult_;
import de.eshg.schoolentry.domain.model.WaitingRoom_;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class SchoolEntryGdprZipEditorProvider extends AbstractGdprZipEditorProvider {

  public SchoolEntryGdprZipEditorProvider(
      @Value("classpath:/gdpr-legal-basis-text.txt") Resource resource) {
    super(resource);
  }

  @Override
  protected ZipEditor createSpecificFilter() {
    return removeFieldFromPath(SchoolEntryProcedure_.LABELS)
        .andThen(
            removeFieldFromPath(
                EyeExaminationResult_.NOTE, SchoolEntryProcedure_.EYE_EXAMINATION_RESULT))
        .andThen(
            removeFieldFromPath(HearingTestResult_.NOTE, SchoolEntryProcedure_.HEARING_TEST_RESULT))
        .andThen(
            removeFieldFromPath(
                SopessExaminationResult_.NOTE, SchoolEntryProcedure_.SOPESS_EXAMINATION_RESULT))
        .andThen(
            removeFieldFromPath(
                DevelopmentScreening_.HANDICAP_NOTE,
                SchoolEntryProcedure_.DEVELOPMENT_SCREENING_RESULT))
        .andThen(removeFieldFromPath(WaitingRoom_.DESCRIPTION, SchoolEntryProcedure_.WAITING_ROOM))
        .andThen(
            removeFieldFromPath(
                DevelopmentScreening_.PHYSICAL_EXAMINATION_NOTE,
                SchoolEntryProcedure_.DEVELOPMENT_SCREENING_RESULT))
        .andThen(
            removeFieldFromPath(
                AppointmentBlockGroup_.PHYSICIANS,
                SchoolEntryProcedure_.APPOINTMENT,
                Appointment_.APPOINTMENT_BLOCK,
                AppointmentBlock_.APPOINTMENT_BLOCK_GROUP))
        .andThen(
            removeFieldFromPath(
                AppointmentBlockGroup_.MFAS,
                SchoolEntryProcedure_.APPOINTMENT,
                Appointment_.APPOINTMENT_BLOCK,
                AppointmentBlock_.APPOINTMENT_BLOCK_GROUP))
        .andThen(
            removeFieldFromPath(
                AppointmentBlockGroup_.CONSULTANTS,
                SchoolEntryProcedure_.APPOINTMENT,
                Appointment_.APPOINTMENT_BLOCK,
                AppointmentBlock_.APPOINTMENT_BLOCK_GROUP))
        .andThen(
            removeArrayEntriesWithValues(
                Procedure_.PROGRESS_ENTRIES,
                SystemProgressEntry_.KEY_DOCUMENT_TYPE,
                List.of("SCHOOL_INFO_LETTER")));
  }
}
