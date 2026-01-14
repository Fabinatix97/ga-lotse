/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.tasks;

import static de.eshg.lib.procedure.domain.model.TaskDueAtReminderNotificationType.ONE_DAY_BEFORE_DUE_AT;
import static de.eshg.lib.procedure.domain.model.TaskDueAtReminderNotificationType.THREE_DAYS_BEFORE_DUE_AT;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.NotificationService;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.lib.notification.api.TaskDueAtReminderNotificationDto;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskDueAtReminderNotification;
import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.lib.procedure.domain.repository.TaskRepository.TaskNotificationPair;
import de.eshg.lib.procedure.util.BusinessDayService;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskDueAtReminderNotificationService implements NotificationService {

  private static final Logger log =
      LoggerFactory.getLogger(TaskDueAtReminderNotificationService.class);

  private final TaskRepository<?> taskRepository;
  private final BusinessModule businessModule;
  private final BusinessDayService businessDayService;

  protected TaskDueAtReminderNotificationService(
      @Autowired TaskRepository<?> taskRepository,
      BusinessModule businessModule,
      BusinessDayService businessDayService) {
    this.taskRepository = taskRepository;
    this.businessModule = businessModule;
    this.businessDayService = businessDayService;
  }

  @Override
  @Transactional(readOnly = true)
  public List<AbstractNotificationDto> getNotificationsForCurrentUser() {
    List<? extends TaskNotificationPair<?>> pairs =
        taskRepository.findAllTaskNotificationPairsByNotificationShouldBeDisplayed(
            businessDayService.nowPlusBusinessDays(ONE_DAY_BEFORE_DUE_AT.getBusinessDays()),
            businessDayService.nowPlusBusinessDays(THREE_DAYS_BEFORE_DUE_AT.getBusinessDays()),
            CurrentUserHelper.getCurrentUserId());

    return pairs.stream().map(this::toInterface).collect(Collectors.toList());
  }

  @Override
  public List<AbstractNotificationDto> getUnreadNotificationsForCurrentUser() {
    List<? extends TaskNotificationPair<?>> pairs =
        taskRepository.findAllTaskNotificationPairsByUnreadAndNotificationShouldBeDisplayed(
            businessDayService.nowPlusBusinessDays(ONE_DAY_BEFORE_DUE_AT.getBusinessDays()),
            businessDayService.nowPlusBusinessDays(THREE_DAYS_BEFORE_DUE_AT.getBusinessDays()),
            CurrentUserHelper.getCurrentUserId());

    return pairs.stream().map(this::toInterface).collect(Collectors.toList());
  }

  @Override
  public void markNotificationsAsRead(List<UUID> notificationIds, Instant now) {
    List<TaskDueAtReminderNotification> relevantNotifications =
        taskRepository.findAllNotificationsByShouldBeDisplayedAndExternalIdIsIn(
            businessDayService.nowPlusBusinessDays(ONE_DAY_BEFORE_DUE_AT.getBusinessDays()),
            businessDayService.nowPlusBusinessDays(THREE_DAYS_BEFORE_DUE_AT.getBusinessDays()),
            CurrentUserHelper.getCurrentUserId(),
            notificationIds);

    log.debug(
        "Marking notifications {} as read",
        relevantNotifications.stream().map(BaseEntityWithExternalId::getExternalId).toList());

    relevantNotifications.forEach(notification -> notification.setReadAt(now));
  }

  private TaskDueAtReminderNotificationDto toInterface(TaskNotificationPair<?> pair) {
    TaskDueAtReminderNotification notification = pair.getNotification();
    Task<?> task = pair.getTask();
    Instant createdAt =
        businessDayService.minusBusinessDays(
            task.getDueAt(), notification.getReminderType().getBusinessDays());
    return new TaskDueAtReminderNotificationDto(
        notification.getExternalId(),
        createdAt,
        notification.getReadAt(),
        businessModule,
        task.getTaskType().name(),
        task.getDueAt(),
        task.getAssignedById(),
        task.getProcedure().getExternalId());
  }
}
