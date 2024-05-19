# Rudimentary Headless CMS

## Overview

This is a very basic headless CMS inspired by Strapi.js. It allows users to create entities from the frontend by specifying their attributes and types. The CMS automatically creates corresponding table definitions in an RDBMS (MySQL). Users can then perform Create, Read, Update, and Delete (CRUD) operations on these entities through the frontend.

## Features

- Create new entities with specified attributes and types.
- Automatically generate database tables based on entity definitions.
- Perform CRUD operations on the created entities.
- Supports MySQL database.

## Technologies Used

- Node.js
- Express.js
- MySQL
- React.js (for frontend)
- Axios (for API requests)

## Prerequisites

- Node.js installed
- MySQL database installed
- Git installed

## Usage

### Creating an Entity
- Open the frontend application in your browser (http://localhost:3000).
- Navigate to the "Create Entity" section.
- Specify the entity name and its attributes (name, type).
- Submit the form to create the entity.

### Performing CRUD Operations
- Navigate to the entity's page from the frontend.
- Use the provided forms to create, read, update, and delete entries for the entity.
