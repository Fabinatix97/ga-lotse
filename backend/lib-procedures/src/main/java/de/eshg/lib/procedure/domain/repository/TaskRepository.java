/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskDueAtReminderNotification;
import de.eshg.lib.procedure.domain.model.TaskType;
import jakarta.persistence.LockModeType;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface TaskRepository<TaskT extends Task<? extends Procedure<?, TaskT, ?, ?>>>
    extends JpaRepository<TaskT, Long>, JpaSpecificationExecutor<TaskT> {

  Optional<TaskT> findByExternalId(UUID externalId);

  @Query("SELECT task FROM #{#entityName} task WHERE task.externalId = :externalId")
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<TaskT> findByExternalIdForUpdate(@Param("externalId") UUID externalId);

  @Query(
      """
          SELECT task FROM #{#entityName} task
          WHERE task.taskStatus = 'OPEN' AND task.currentAssignment.assigneeId in :assigneeIds
          ORDER BY task.createdAt ASC
          """)
  List<TaskT> findAllByTaskStatusOpenAndAssigneeIdIn(@Param("assigneeIds") Set<UUID> assigneeIds);

  @Query(
      """
          SELECT task as task, notification as notification FROM #{#entityName} as task
          INNER JOIN task.notifications as notification
          JOIN FETCH task.procedure
          WHERE (
          (notification.reminderType = 'ONE_DAY_BEFORE_DUE_AT' AND task.dueAt <= :oneBusinessDayFromNow)
          OR
          (notification.reminderType = 'THREE_DAYS_BEFORE_DUE_AT' AND task.dueAt <= :threeBusinessDaysFromNow)
          )
          AND task.currentAssignment.assigneeId = :assigneeId
          ORDER BY task.dueAt, notification.id
          """)
  List<TaskNotificationPair<TaskT>> findAllTaskNotificationPairsByNotificationShouldBeDisplayed(
      @Param("oneBusinessDayFromNow") Instant oneBusinessDayFromNow,
      @Param("threeBusinessDaysFromNow") Instant threeBusinessDaysFromNow,
      @Param("assigneeId") UUID assigneeId);

  @Query(
      """
          SELECT task as task, notification as notification FROM #{#entityName} as task
          INNER JOIN task.notifications as notification
          JOIN FETCH task.procedure
          WHERE (
          (notification.reminderType = 'ONE_DAY_BEFORE_DUE_AT' AND task.dueAt <= :oneBusinessDayFromNow)
          OR
          (notification.reminderType = 'THREE_DAYS_BEFORE_DUE_AT' AND task.dueAt <= :threeBusinessDaysFromNow)
          )
          AND task.currentAssignment.assigneeId = :assigneeId
          AND notification.readAt IS NULL
          ORDER BY task.dueAt, notification.id
          """)
  List<TaskNotificationPair<TaskT>>
      findAllTaskNotificationPairsByUnreadAndNotificationShouldBeDisplayed(
          @Param("oneBusinessDayFromNow") Instant oneBusinessDayFromNow,
          @Param("threeBusinessDaysFromNow") Instant threeBusinessDaysFromNow,
          @Param("assigneeId") UUID assigneeId);

  @Query(
      """
          SELECT notification FROM #{#entityName} as task
          INNER JOIN task.notifications as notification
          WHERE (
          (notification.reminderType = 'ONE_DAY_BEFORE_DUE_AT' AND task.dueAt <= :oneBusinessDayFromNow)
          OR
          (notification.reminderType = 'THREE_DAYS_BEFORE_DUE_AT' AND task.dueAt <= :threeBusinessDaysFromNow)
          )
          AND task.currentAssignment.assigneeId = :assigneeId
          AND notification.externalId IN :externalIds
          ORDER BY task.dueAt, notification.id
          """)
  List<TaskDueAtReminderNotification> findAllNotificationsByShouldBeDisplayedAndExternalIdIsIn(
      @Param("oneBusinessDayFromNow") Instant oneBusinessDayFromNow,
      @Param("threeBusinessDaysFromNow") Instant threeBusinessDaysFromNow,
      @Param("assigneeId") UUID assigneeId,
      @Param("externalIds") List<UUID> externalIds);

  @Query(
      """
      SELECT DISTINCT task.taskType FROM #{#entityName} as task
      INNER JOIN task.procedure as procedure
      WHERE procedure.procedureType = :procedureType
      """)
  Set<TaskType> findDistinctTaskTypesForProcedureType(
      @Param("procedureType") ProcedureType procedureType);

  @Query(
      """
        SELECT t.task_count AS occurrence, COUNT(*) AS frequency
        FROM (
            SELECT COUNT(task.id) AS task_count
            FROM #{#entityName} task
            JOIN task.procedure procedure
            WHERE procedure.procedureType = :procedureType
            AND task.taskType = :taskType
            AND procedure.procedureStatus = 'CLOSED'
            AND procedure.createdAt BETWEEN :start AND :end
            GROUP BY procedure.id
        ) AS t
        GROUP BY t.task_count
      """)
  Stream<TaskTypeCount> countTaskTypeForClosedProcedures(
      @Param("procedureType") ProcedureType procedureType,
      @Param("taskType") TaskType taskType,
      @Param("start") Instant start,
      @Param("end") Instant end);

  @Query(
      """
        SELECT (task.modifiedAt - task.createdAt) AS duration FROM #{#entityName} task
        INNER JOIN task.procedure as procedure
        WHERE procedure.procedureType = :type
        AND task.taskType = :taskType
        AND task.taskStatus = "CLOSED"
        AND procedure.procedureStatus = "CLOSED"
        AND procedure.createdAt BETWEEN :start AND :end
        ORDER BY task.id
    """)
  List<Duration> findTaskDurations(
      @Param("type") ProcedureType type,
      @Param("taskType") TaskType taskType,
      @Param("start") Instant start,
      @Param("end") Instant end);

  interface TaskNotificationPair<T extends Task<?>> {
    T getTask();

    TaskDueAtReminderNotification getNotification();
  }

  interface TaskTypeCount {
    long getOccurrence();

    long getFrequency();
  }
}
