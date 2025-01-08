/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model.element;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "EditorElementAnswer")
public record EditorElementAnswerDto(
    @NotNull UUID answerId,
    @NotNull boolean selected,
    @NotNull String answerText,
    String extraText) {}
