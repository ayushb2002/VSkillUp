from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    context = {
        "page": "index",
        "data": "Welcome to VskillUp"
    }
    return jsonify(context)

@app.route("/login")
def login():

    context = {
        "page": "login_form",
        "data": "To be received!"
    }

    return jsonify(context)

@app.route("/register")
def register():

    context = {
        "page": "register_form",
        "data": "To be received!"
    }

    return jsonify(context)

@app.route("/learn")
def learn():

    context = {
        "page": "learn",
        "data": "Learn at VSkillUp"
    }

    return jsonify(context)
