"""
app.py
======

A minimal customer relationship management (CRM) admin panel built with
Flask and SQLAlchemy.  This application provides a simple CRUD interface
for managing customer records stored in a local SQLite database.  It
includes routes for listing all customers, adding new customers, editing
existing customers and deleting customers.

To start the server install the dependencies listed in the repository’s
`requirements.txt` and run this file.  The first request will create the
SQLite database automatically.
"""

from __future__ import annotations

from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///crm.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "change-me"  # used for flashing messages
db = SQLAlchemy(app)


class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30), nullable=True)

    def __repr__(self) -> str:
        return f"<Customer {self.id} {self.name}>"


@app.before_first_request
def create_tables() -> None:
    """Create database tables on the first request."""
    db.create_all()


@app.route("/")
def index() -> str:
    customers = Customer.query.all()
    return render_template("index.html", customers=customers)


@app.route("/add", methods=["GET", "POST"])
def add_customer() -> str:
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        if not name or not email:
            flash("Name and email are required.", "error")
        else:
            customer = Customer(name=name, email=email, phone=phone)
            db.session.add(customer)
            db.session.commit()
            flash("Customer added successfully.", "success")
            return redirect(url_for("index"))
    return render_template("form.html", customer=None)


@app.route("/edit/<int:customer_id>", methods=["GET", "POST"])
def edit_customer(customer_id: int) -> str:
    customer = Customer.query.get_or_404(customer_id)
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        if not name or not email:
            flash("Name and email are required.", "error")
        else:
            customer.name = name
            customer.email = email
            customer.phone = phone
            db.session.commit()
            flash("Customer updated successfully.", "success")
            return redirect(url_for("index"))
    return render_template("form.html", customer=customer)


@app.route("/delete/<int:customer_id>")
def delete_customer(customer_id: int) -> str:
    customer = Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    flash("Customer deleted successfully.", "success")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)