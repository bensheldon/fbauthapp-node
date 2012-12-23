# fbauthapp-node

A simple app that uses Facebook for user authentication.

## Environment Variables

I use Foreman and put these into a `.env`-file and run it with `$ foreman run node server`:

```
FB_APP=<APP_ID>:<APP_SECRET>
PG=postgres://postgres:pw@localhost:5432/db
PG_TEST=postgres://postgres:pw@localhost:5432/db_test
```