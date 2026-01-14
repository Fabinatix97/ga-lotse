/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionPhase")
public enum InspectionPhase {
  /** default phase for new followup inspection procedures */
  NEW,

  /**
   * inspection procedure is being planned. Manually created inspections will immediately be put
   * into this phase, so they can have a planning task with an assignee.
   */
  PLANNING,

  /**
   * inspection procedure has all requirements fulfilled to execute an inspection of a facility, but
   * the inspection has not yet begun.
   */
  READY_FOR_EXECUTION,

  /** inspection is currently in progress; checklists get filled etc. */
  EXECUTING,

  /**
   * inspection has been executed and was finalized with a signature from the facility
   * representative.
   */
  EXECUTED,

  /** reviewer is creating report and invoices */
  CREATING_REPORT_AND_INVOICE,

  /** inspection procedure is done. */
  CLOSED
}
