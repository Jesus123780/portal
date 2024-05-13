# BAC Project

Welcome to the BAC project, an application for card dispatch in the banking sector. This project is designed to streamline the card issuance and management process for banking purposes.

## Dependencies
* NextJS
* ReactJs
* Redux
* Material UI
* Docker

## Environment Variables

* `REACT_APP_USER`: Database user name.
* `REACT_APP_PASSWORD`: Database user password.
* `REACT_APP_SERVER`:  IP address/DNS of the database server.
* `REACT_APP_DATABASE`: Database name.
* `REACT_APP_DATABASE_POOL_SIZE`: Database connection pool size.
* `REACT_APP_API_AZURE_INSTRUMENTATION_KEY`: Instrumentation key for the API.
* `REACT_APP_FRONT_AZURE_INSTRUMENTATION_KEY`:  Instrumentation key for the Front-end.


## Guide

Follow these steps to configure and run the project in your local environment:


1. **Dependency Installation**: Use the following command to install all the necessary dependencies:

   ```bash
   npm install
   ```

2. **Execution**:  Use the following command to run the project locally:

   ```bash
   npm run dev
   ```

3. **Testing**: Use the following command to generate a production version:

   ```bash
   npm run build
   ```

3. **Docker Image Generation**:  Use the following command to build the necessary Docker image:

   ```bash
   docker build -t [nombre-imagen]:[tag] .
   ```