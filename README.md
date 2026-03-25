# Lambda_BOCC — Hexagonal POC

This repository is a small Proof of Concept implementing Hexagonal Architecture
in Node.js / TypeScript for AWS Lambda.

Quick start

1. Install dependencies

```bash
npm ci
```

2. Run tests

```bash
npm test
```

3. Build (compile TypeScript)

```bash
npm run build
```

Deployment notes

- Build output: the project compiles TypeScript into `dist/` via `tsc` (see `npm run build`).
- Compiled handler path: with the current `tsconfig.json` (`rootDir: src`, `outDir: dist`) the
  Lambda handler entry is `dist/interfaces/http/handler.handler` (this maps to the
  exported `handler` in `src/interfaces/http/handler.ts`).
- Environment variables: the Lambda must be provided Postgres credentials. Recommended names:
  `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` (or a single `DATABASE_URL`). See `.env.example`.
- Postgres and connections: the Postgres adapter uses a global Pool instance so a new Pool is not
  created on every invocation — suitable for serverless environments. If your RDS is inside a VPC,
  configure the Lambda to run in the same VPC/subnets and attach the proper Security Group.
- RDS Proxy: for production workloads it's recommended to put an RDS Proxy in front of RDS to avoid
  connection exhaustion and improve scaling.

Packaging (artifact ready for Lambda)

- Option A (simple ZIP with production deps):
  1. `npm run build`
  2. `npm run package` (this creates `deployment.zip` containing `dist/` and production `node_modules`)

- Option B (recommended advanced): bundle with `esbuild` into a single file/folder and upload a
  smaller artifact. See `package:esbuild` placeholder and the `esbuild` docs if you want a single-file bundle.

Handler config in AWS

- Set the Lambda handler to: `interfaces/http/handler.handler` if you upload the contents of `dist/` as
  the function root, or `dist/interfaces/http/handler.handler` if you upload a zip containing `dist/` at root.

Runtime & sizing

- Runtime: Node.js 18.x or later.
- Memory/Timeout: start with `512 MB` and `30s` timeout for VPC-connected RDS calls; tune based on latency.

Secrets & IAM

- Prefer AWS Secrets Manager or SSM Parameter Store over plain environment variables. Grant the Lambda role
  read access to the secret (and CloudWatch Logs permissions). If using Secrets Manager, add `secretsmanager:GetSecretValue`.

CI / Deploy

- A GitHub Actions workflow is included at `.github/workflows/ci-deploy.yml`. It runs tests, builds and
  packages the artifact. If you set the following secrets, it can also update an existing Lambda function:
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `LAMBDA_FUNCTION_NAME`.

Testing in AWS

- You can test the deployed Lambda using API Gateway HTTP events or the Lambda console's "test event".
- Example curl (if you front with API Gateway):

```bash
curl -X POST https://<api-gateway-endpoint>/items -H 'Content-Type: application/json' -d '{"name":"foo"}'
```

Step-by-step: subir y probar (para el equipo que recibe el ZIP)

1. Subir el ZIP al Lambda (consola):
  - Runtime: `nodejs18.x`
  - Code -> Upload from .zip file -> seleccionar `deployment.zip` (o `deployment-esbuild.zip`)
  - Handler:
    - `interfaces/http/handler.handler` (si usas `deployment.zip`)
    - `index.handler` (si usas `deployment-esbuild.zip`)
  - Environment variables: definir `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (o `DATABASE_URL`).
  - Memory/Timeout: comenzar con `512 MB` y `30s`.

2. Si la base de datos está en VPC:
  - Configurar la Lambda para usar las mismas subnets privadas y Security Group que permiten la conexión a RDS.
  - (Preferible) configurar un RDS Proxy y apuntar la Lambda al endpoint del proxy.

3. Probar desde la consola de Lambda:
  - Crear un "test event" con un payload HTTP similar. Ejemplo para crear item:
    ```json
    {
     "httpMethod": "POST",
     "path": "/items",
     "body": "{\"name\":\"prueba\"}"
    }
    ```

4. Ver logs:
  - Abrir CloudWatch Logs -> Grupo de logs de la función Lambda -> revisar la invocación.

5. (Opcional) Actualizar código vía AWS CLI:
  ```bash
  aws lambda update-function-code --function-name <NOMBRE_LAMBDA> --zip-file fileb://deployment.zip --region <REGION>
  aws lambda update-function-configuration --function-name <NOMBRE_LAMBDA> --timeout 30 --memory-size 512 --region <REGION>
  ```

Optional improvements

- Add an automated deployment step that provisions or updates the Lambda (SAM / CDK / Serverless framework).
- Use RDS Proxy for better connection management.

See the `.env.example`, `.github/workflows/ci-deploy.yml` and `scripts/package.js` for concrete commands and examples.

Testing

- Tests are unit-level and mock repository adapters. They validate behavior,
  not implementation details.

Code organization

- `src/domain` — domain entities (pure, no external deps)
- `src/application/use-cases` — business logic (pure functions/classes)
- `src/adapters/postgres` — Postgres adapters (outer layer)
- `src/interfaces/http` — Lambda handler (thin transport layer)

