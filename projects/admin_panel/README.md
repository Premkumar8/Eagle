# CRM Admin Panel

This project implements a minimal customer relationship management (CRM)
administrative panel using the Flask web framework.  It provides a simple
CRUD (create, read, update, delete) interface for managing customer
records stored in a local SQLite database via SQLAlchemy.

The application demonstrates how to build a basic data administration
tool with Python, including database setup, routing, HTML templates and
form handling.

## Features

* List all customers in a table
* Create new customer entries
* Edit existing customers
* Delete customers from the system

## Prerequisites

You need Python 3.7 or later.  The required Python packages are listed
in the repository‑wide `requirements.txt` file.  In particular this
project depends on `flask` and `flask_sqlalchemy`.

Install the dependencies from the repository root:

```bash
pip install -r ../requirements.txt
```

## Running the Application

From within the `admin_panel` directory start the Flask development server:

```bash
python app.py
```

The first time you run the server it will create a local SQLite database
file called `crm.db`.  Open your browser and navigate to
`http://localhost:5000` to interact with the admin panel.  Use the
"Add Customer" button to create new entries and click the edit/delete
links next to each customer to modify or remove them.

## File Overview

- `app.py` – Main application file with routes and database model
- `templates/` – HTML templates used by Flask
  - `base.html` – Base layout template
  - `index.html` – List view of all customers
  - `form.html` – Form for adding/editing customers
- `static/` – Directory for static files such as custom CSS (optional)