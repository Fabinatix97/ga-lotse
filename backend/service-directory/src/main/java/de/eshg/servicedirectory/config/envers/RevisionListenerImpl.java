/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.config.envers;

import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.servicedirectory.common.CallingClientHelper;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class RevisionListenerImpl implements org.hibernate.envers.RevisionListener {

  private static final Logger logger = LoggerFactory.getLogger(RevisionListenerImpl.class);

  @Override
  public void newRevision(Object revisionEntity) {
    RevisionEntity customRevisionEntity = (RevisionEntity) revisionEntity;
    String commitAuthor = CommitAuthorHolder.getAuthor();
    if (commitAuthor != null) {
      customRevisionEntity.setAuthor(commitAuthor);
      customRevisionEntity.setCommitter(AdminNameHolder.getAdminName());
    } else {
      String adminName = AdminNameHolder.getAdminName();
      if (adminName != null) {
        customRevisionEntity.setAuthor(adminName);
      } else {
        customRevisionEntity.setAuthor(CallingClientHelper.getClientCommonName());
      }
    }

    HttpServletRequest servletRequest = getServletRequestFromContext();
    if (servletRequest != null) {
      customRevisionEntity.setIp(servletRequest.getRemoteAddr());
      customRevisionEntity.setResource(
          servletRequest.getMethod() + " " + servletRequest.getRequestURI());
    } else {
      logger.warn("No servlet request in context. Cannot set IP and resource in revision.");
    }
  }

  private HttpServletRequest getServletRequestFromContext() {
    RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();

    if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
      return servletRequestAttributes.getRequest();
    } else {
      return null;
    }
  }
}
