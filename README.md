# Bank API with NodeJS, PostgreSQL, Typescript and Docker

A simple API for bank transactions that include :

1. Money transfer
2. Money withdrawal
3. Money deposit
4. Transaction records

### Technologies

1. NodeJS
2. Typescript
3. PosgreSQL
4. Docker
5. Docker Compose

### Concept

- REST API principals
  - CRUD
  - HTTP method
- JWT
- Authentication & authorization middleware
- Raw SQL query and leveraging database transaction

### How to run in local

Since this application is using docker, you need to have Docker already installed in you local machine. Below command will install all the dependencies, make migrations to database and run the application

```
docker compose up --build
```
