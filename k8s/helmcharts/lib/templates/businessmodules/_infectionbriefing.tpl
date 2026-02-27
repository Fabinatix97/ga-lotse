S{{- define "module.infectionbriefing.container" }}
{{- if not .Values.businessmoduleDefaults.database.selfmanaged }}
- name: spring.datasource.url
  value: "jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=verify-full&sslrootcert=/var/run/db-certs/ca.crt"
{{- else }}
- name: spring.datasource.url
  value: "jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
{{- end }}
- name: DB_HOST
  valueFrom:
    secretKeyRef:
      name: infectionbriefing-db
      key: POSTGRESQL_HOST
- name: DB_PORT
  valueFrom:
    secretKeyRef:
      name: infectionbriefing-db
      key: POSTGRESQL_PORT
- name: DB_NAME
  valueFrom:
    secretKeyRef:
      name: infectionbriefing-db
      key: POSTGRESQL_DB
- name: spring.datasource.username
  valueFrom:
    secretKeyRef:
      name: infectionbriefing-db
      key: POSTGRESQL_USER
- name: spring.datasource.password
  valueFrom:
    secretKeyRef:
      name: infectionbriefing-db
      key: POSTGRESQL_PASSWORD
- name: de.eshg.base.service-url
  value: "http://base{{ .Values.domains.clusterLocalSuffix }}"
- name: eshg.keycloak.url
  value: "https://{{ .Values.domains.hosts.keycloak }}"
- name: eshg.keycloak.internal.url
  value: "https://{{ .Values.domains.hosts.keycloakInternal }}"
- name: eshg.citizen-portal.reverse-proxy.url
  value: "https://{{ .Values.domains.hosts.citizenportal }}"
- name: spring.security.oauth2.client.registration.module-client.client-id
  value: system-infection-briefing
- name: spring.security.oauth2.client.registration.module-client.client-secret
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: infection-briefing-module-client-secret
{{- end }}
