import os
import pathlib
import requests
from flask import Flask, session, abort, redirect, request, jsonify
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
from google.cloud import firestore
from flask_bcrypt import Bcrypt

app = Flask(__name__) 
bcrypt = Bcrypt(app) 
app.secret_key = os.environ.get("SECRET_KEY")
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" 

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client-secret.json")  
db = firestore.Client(project='vskillup')

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],  
    redirect_uri="http://127.0.0.1:5000/callback" 
)

def login_is_required(function):  
    def wrapper(*args, **kwargs):
        if "google_id" not in session:  
            return abort(401)
        else:
            return function()

    return wrapper


@app.route("/login_via_google")  
def login_via_google():
    try:
        if session['non_google_id']:
            return redirect('/welcome')
        
        if session['google_id']:
            return redirect('/protected_area')
    except:
        pass
    authorization_url, state = flow.authorization_url()  
    session["state"] = state
    return redirect(authorization_url)


@app.route("/callback")  
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        abort(500) 

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")
    session["given_name"] = id_info.get("given_name")
    session["family_name"] = id_info.get("family_name")
    session['email'] = id_info.get("email")
    return redirect("/protected_area")  


@app.route("/logout")  
def logout():
    session.clear()
    return redirect("/")


@app.route("/")  
def index():
    context = {
        "login_via_google": "http://127.0.0.1:5000/login_via_google"
    }
    return jsonify(context)


@app.route("/protected_area")  
@login_is_required
def protected_area():
    context = {
        "first_name": session['given_name'],
        "last_name": session['family_name'],
        "email": session['email'],
        "logout": "http://127.0.0.1:5000/logout" 
    }
    return jsonify(context) 

def writeRegister(fname, lname, email, pwd):
    try: 
        doc_ref = db.collection(u'users').document(email)
        doc_ref.set({
            u'first_name': fname,
            u'last_name': lname,
            u'email': email,
            u'password': pwd
        })
        return True
    except:
        return False    

@app.route("/register", methods=["POST", "GET"])
def register():
    try:
        if session['google_id']:
            return redirect('/login_via_google')
        elif session['non_google_id']:
            return redirect('/welcome')
    except:
        pass
    
    if request.method == "POST":
        first_name = request.args.get('first_name')
        last_name = request.args.get('last_name')
        email = request.args.get('email')
        pwd = request.args.get('password')
        hash_pwd = bcrypt.generate_password_hash(pwd)

        if writeRegister(first_name, last_name, email, hash_pwd):
            context = {"registered": True, "main_page": "http://127.0.0.1:5000/"}
            return jsonify(context)
        else:
            context = {"registered": False, "main_page": "http://127.0.0.1:5000/"}
            return jsonify(context)
    else:
        context = {
            "message": "Use POST request to register yourself!", 
            "main_page": "http://127.0.0.1:5000/"
        }
        return jsonify(context)

@app.route("/login", methods=["POST", "GET"])
def login():
    try:
        if 'google_id' in session:
            return redirect('/login_via_google')
        elif 'non_google_id' in session:
            return redirect('/welcome')
    except:
        pass
    
    if request.method == "POST":
        email = request.args.get('email')
        pwd = request.args.get('password')
        
        users_ref = db.collection(u'users')
        
        if users_ref.document(email).get():
            data = users_ref.document(email).get().to_dict()
            if not data:
                context = {
                        "message": "User email address not registered!",
                        "main_page": "http://127.0.0.1:5000/"
                    }
                return jsonify(context)
            if bcrypt.check_password_hash(data['password'], pwd):
                session['given_name'] = data['first_name']
                session['family_name'] = data['last_name']
                session['email'] = data['email']
                session['non_google_id'] = True
                context = {
                    "first_name": session['given_name'],
                    "last_name": session['family_name'],
                    "email": session['email'],
                    "logout": "http://127.0.0.1:5000/logout" 
                }
                return jsonify(context) 
            else:
                context = {
                    "message": "User password is invalid!",
                    "main_page": "http://127.0.0.1:5000/"
                }
                return jsonify(context)
        else:
            context = {
                    "message": "User email address not registered!",
                    "main_page": "http://127.0.0.1:5000/"
                }
            return jsonify(context)

    else:
        context = {
            "message": "Use POST request to login yourself!", 
            "main_page": "http://127.0.0.1:5000/"
        }
        return jsonify(context)

@app.route('/welcome', methods=["GET", "POST"])
def welcome():
    context = {
        "first_name": session['given_name'],
        "last_name": session['family_name'],
        "email": session['email'],
        "logout": "http://127.0.0.1:5000/logout" 
    }
    return jsonify(context) 


if __name__ == "__main__": 
    app.run(debug=True)