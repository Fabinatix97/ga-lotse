/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import de.eshg.lib.procedure.model.AssignTaskRequest;
import de.eshg.lib.procedure.model.GetTaskByUserResponse;
import de.eshg.lib.procedure.model.SelfAssignTaskRequest;
import de.eshg.lib.procedure.model.TaskDto;
import de.eshg.rest.service.security.config.BaseUrls.ProcedureLibrary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import java.util.Set;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PutExchange;

public interface TaskApi extends TaskListApi {

  final class QueryParameter {
    public static final String ASSIGNEE_ID = "assigneeId";

    private QueryParameter() {}
  }

  @PutExchange(ProcedureLibrary.TASKS_API + "/{taskId}/assignment")
  TaskDto assignTask(
      @PathVariable("taskId") UUID taskId, @Valid @RequestBody AssignTaskRequest assignTaskRequest);

  @PutExchange(ProcedureLibrary.TASKS_API + "/{taskId}/self-assignment")
  TaskDto selfAssignTask(
      @PathVariable("taskId") UUID taskId,
      @Valid @RequestBody SelfAssignTaskRequest assignTaskRequest);

  @GetExchange(ProcedureLibrary.TASKS_TEAM_VIEW)
  @Operation(description = "Returns all _open_ tasks per module group member.")
  GetTaskByUserResponse getTasksByAssignee(
      @Parameter(
              description =
                  """
                  If provided, `assignee` must be member of the module group.
                  If not provided, all tasks for all members of the module group are returned.
                  """)
          @RequestParam(required = false, name = QueryParameter.ASSIGNEE_ID)
          @Valid
          Set<UUID> assigneeId);
}
