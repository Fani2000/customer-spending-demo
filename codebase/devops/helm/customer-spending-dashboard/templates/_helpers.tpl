{{/*
Expand the name of the chart.
*/}}
{{- define "customer-spending-dashboard.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "customer-spending-dashboard.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "customer-spending-dashboard.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "customer-spending-dashboard.labels" -}}
helm.sh/chart: {{ include "customer-spending-dashboard.chart" . }}
{{ include "customer-spending-dashboard.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "customer-spending-dashboard.selectorLabels" -}}
app.kubernetes.io/name: {{ include "customer-spending-dashboard.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "customer-spending-dashboard.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "customer-spending-dashboard.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
PostgreSQL connection string
*/}}
{{- define "customer-spending-dashboard.postgresConnectionString" -}}
{{- if .Values.configMap.database.connectionString }}
{{- .Values.configMap.database.connectionString }}
{{- else }}
Host={{ include "customer-spending-dashboard.fullname" . }}-postgres;Port=5432;Database={{ .Values.postgresql.auth.database }};Username={{ .Values.postgresql.auth.username }};Password={{ .Values.postgresql.auth.postgresPassword }}
{{- end }}
{{- end }}

