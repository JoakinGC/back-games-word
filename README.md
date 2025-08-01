# Back end Games

Este es el back del repositorio de juegos con palabras de `https://github.com/JoakinGC/games-practices`. Usando node, Prisma, Clerk, TypeScript, MySQL y Express se desarrollo un back end con arquitectura limpia.

## Orden de ficheros:

### `domain/` El núcleo de la lógica.

En el esta toda nuestra logica de negocio y que si cambiamos de framework o DB o otras tecnologias estan no deberian verse afectadas.

### `application/` – Lógica de negocio (Casos de uso)

`use-cases/`: Casos de uso concretos.
Ej: CreateWord.ts, GetUserById.ts, AddRelation.ts.
Contiene la accion espeficica de manera sencilla

### `infrastructure/` – Infraestructura técnica


`database/`: Aquí va las implementaciones en este caso de Prisma.

`config/`: Configuraciones del servidor

`web/`: Los controladores, middlewares y rutas de la API's y tambien el control de errores.



## Despliegue en local

Clona el repositorio:

```bash
git clone https://github.com/JoakinGC/back-games-word.git
```

Luego instala las dependencias:

```bash
yarn install
```
Inicializa TS:
```bash
npx tsc --init
```
Inicia Prisma:

```bash
yarn prisma init
yarn prisma migrate dev --name init
yarn prisma generate
```

Y ejecuta con 

```bash
yarn dev
```

## Modelos de datos y estructura:

Tres tablas o modelos en ello se difinieron `word`:

```
model Word {
  id          Int             @id @default(autoincrement())
  text        String          @unique
  definition  String          @db.Text
  origin      String?         // idioma, región, etc.
  latin       String?         // raíz latina opcional

  // Relaciones (bidireccionales)
  relationsFrom WordRelation[] @relation("FromWord")
  relationsTo   WordRelation[] @relation("ToWord")
}
```

La de `user`:
```
model User {
  id        Int      @id @default(autoincrement())
  clerkId   String   @unique           
  email     String   @unique
  name      String
  score     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
El modelo `word` puede tener sinonimos y antonimos por lo que tiene una relación consigo mismo, de n a n, ya que puede tener muchos antonimos o sinonimos una palabra.


