# Lambda POC — Instrucciones mínimas

Pasos mínimos para compilar, ejecutar pruebas, empaquetar el artefacto y desplegar a AWS Lambda.

Requisitos
- Node.js 18+

Instalación

```bash
npm ci
```

Compilar

```bash
npm run build
```

Ejecutar pruebas

```bash
npm test
```

Empaquetar (genera `deployment.zip`)

```bash
npm run package
```

Despliegue: subir `deployment.zip` desde la consola de AWS

1. Abrir AWS Console → Lambda → Create function (o abrir función existente).
2. En la sección "Code" seleccionar "Upload from" → ".zip file" y subir `deployment.zip`.
3. Verificar `Runtime: nodejs18.x` y `Handler: interfaces/http/handler.handler`.
4. Configurar variables de entorno: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (o `DATABASE_URL`).

Permisos IAM recomendados (mínimo): `lambda:CreateFunction`, `lambda:UpdateFunctionCode`, `iam:PassRole`.

Variables de entorno y secretos
- Variables de entorno esperadas por la función:
	- `ARN_SECRET` — ARN del secreto en Secrets Manager (opcional si se usa Parameter Store).
	- `ACO_DB_PORT` — puerto de la base de datos (ej. `5432`).
	- `ENV_REGION` — región AWS donde corre la función (ej. `us-east-1`).

- Parameter Store (SSM) — claves esperadas:
	- `/ACO/BOCC/dbHost`
	- `/ACO/BOCC/dbName`

- Secrets Manager — secretos esperados (nombres):
	- `acoDbUser`
	- `acoDbPass`

Coloca valores en Environment variables (Configuration → Environment variables) o usa SSM/Secrets Manager y pasa solo el ARN/identificadores en variables de entorno.


