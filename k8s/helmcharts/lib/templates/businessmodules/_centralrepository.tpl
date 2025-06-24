{{- define "module.centralrepository.container" }}
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
      name: centralrepository-db
      key: POSTGRESQL_HOST
- name: DB_PORT
  valueFrom:
    secretKeyRef:
      name: centralrepository-db
      key: POSTGRESQL_PORT
- name: DB_NAME
  valueFrom:
    secretKeyRef:
      name: centralrepository-db
      key: POSTGRESQL_DB
- name: spring.datasource.username
  valueFrom:
    secretKeyRef:
      name: centralrepository-db
      key: POSTGRESQL_USER
- name: spring.datasource.password
  valueFrom:
    secretKeyRef:
      name: centralrepository-db
      key: POSTGRESQL_PASSWORD
- name: eshg.servicedirectory.baseUrl
  value: http://{{ .Values.domains.centralservices.servicedirectory }}
- name: eshg.keycloak.url
  value: "https://{{ .Values.domains.hosts.keycloak }}"
- name: eshg.keycloak.internal.url
  value: "https://{{ .Values.domains.hosts.keycloakInternal }}"
{{- end }}
