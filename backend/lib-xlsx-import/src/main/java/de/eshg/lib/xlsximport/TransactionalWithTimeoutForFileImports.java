/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport;

import static de.eshg.lib.common.TimeoutConstants.LONG_RUNNING_OPERATION_TIMEOUT_SECONDS;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.transaction.annotation.Transactional;

/**
 * For file imports, we use an extended timeout of 120s (Nginx: proxy_read_timeout 120s). If the
 * timeout is reached, Nginx returns an HTTP 504, but the import continues running in the backend.
 * This can be confusing for users if the import completes successfully after an error is shown in
 * the frontend. To prevent this, we set a transaction timeout to ensure the transaction is not
 * committed in such cases.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Transactional(timeout = LONG_RUNNING_OPERATION_TIMEOUT_SECONDS)
public @interface TransactionalWithTimeoutForFileImports {}
