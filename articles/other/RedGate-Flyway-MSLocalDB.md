# RedGate Flyway MSLocalDB
RedGate Flyway is a cool add-on to your toolbox. This tool allows developers to write SQL statements that 
can be use to run migrations against MS SQL and keep things in check by adding to source code like Git. 
However, I prefer using MS LocalDB to avoid having to install a full SQL server on my development 
machine. Below are the steps to achieve this.

### MS LocalDB Setup
* Download `jtds-1.3.3-dist.zip` from [here](https://github.com/milesibastos/jTDS/releases)
* Extract All then copy `jtds-1.3.3.jar` to `...\node_modules\flywaydb-cli\bin\drivers`
* Delete or rename `jtds-1.3.1.jar`
* Rename `jtds-1.3.3.jar` to `jtds-1.3.1.jar`
* Get LocalDB Pipe instance via command prompt
  * ```cmd
    >sqllocaldb info MSSQLLocalDB
    ```
* Update "environment.config"
```
#flyway.url=jdbc:sqlserver://#{dbHost}#:1433;databaseName=#{dbName}#;
flyway.url=jdbc:jtds:sqlserver://./#{dbName}#;instance=LOCALDB#331AB26D;namedPipe=true
flyway.user=sa
flyway.password=#{dbAdminPass}#
```

> NOTE! NamedPipe Id is changed every time LocalDB is restarted.

Now start the migration!
```
>npm run migrate
```