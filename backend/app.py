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
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np

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

def universal_login_condition():
    try:
        if 'google_id' in session:
            return redirect('/login_via_google')
        elif 'non_google_id' in session:
            return redirect('/welcome')
    except:
        return False

    return True

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
        "login_via_google": "http://127.0.0.1:5000/login_via_google",
        "login via POST": "http://127.0.0.1:5000/login" 
    }
    return jsonify(context)


@app.route("/protected_area")  
@login_is_required
def protected_area():
    doc_ref = db.collection(u'users').document(session['email']).get().to_dict()
    if doc_ref is None:
        writeRegister(session['given_name'], session['family_name'], session['email'], bcrypt.generate_password_hash("auth-via-google"))

    return redirect('/welcome')

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
                return redirect('/welcome')
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
    if universal_login_condition():
        data = db.collection(u'users').document(session['email']).get().to_dict()
        if not data:
            return redirect('/logout')
        
        if 'age' not in data.keys() or 'education' not in data.keys():
            return redirect('/personalInformation')
        
        session['age'] = data['age']
        session['education'] = data['education']
        
        if 'level' not in data.keys():
            return redirect('/level')
        
        session['level'] = data['level']

        context = {
            "first_name": session['given_name'],
            "last_name": session['family_name'],
            "email": session['email'],
            "age": session['age'],
            "education": session['education'],
            "level": session['level'],
            "logout": "http://127.0.0.1:5000/logout" 
        }
        return jsonify(context)
    else:
        return redirect('/') 

def writePersonalInformation(age, education):
    try: 
        doc_ref = db.collection(u'users').document(session['email'])
        doc_ref.set({
            u'age': age,
            u'education': education
        }, merge=True)
        return True
    except:
        return False    

@app.route("/personalInformation", methods=['GET', 'POST'])
def personalInformation():
    if universal_login_condition():

        if request.method == "POST":
            
            age = request.args.get('age')
            education = request.args.get('education')

            if not age or not education:
                context = {
                    "message": "Please add personal information via POST to proceed!",
                    "logout": "http://127.0.0.1:5000/logout" ,
                    "main_page": "http://127.0.0.1:5000" 
                }
                return jsonify(context)

            if writePersonalInformation(age, education):
                return redirect('/welcome')
            
            else:
                context = {
                    "error": "Personal information could not be added! Please logout and retry!",
                    "logout": "http://127.0.0.1:5000/logout" ,
                    "main_page": "http://127.0.0.1:5000" 
                }

        else:
            context = {
                "message": "Please add personal information via POST to proceed!",
                "logout": "http://127.0.0.1:5000/logout" ,
                "main_page": "http://127.0.0.1:5000" 
            }
            return jsonify(context)
        
    else:
        return redirect('/')

def suggest_level():
    ageRange = ['Below 18', 'Between 18 to 40', 'Above 40']
    educationRange = ['Kindergarten', 'Primary School', 'Secondary School', 'Graduate', 'Post Graduate']
    
    combinations = {
        "Beginner": [(ageRange[0], educationRange[0]), (ageRange[0], educationRange[1]), (ageRange[1], educationRange[0]), (ageRange[2], educationRange[0])],
        "Intermediate": [(ageRange[0], educationRange[2]), (ageRange[0], educationRange[3]), (ageRange[1], educationRange[1]), (ageRange[1], educationRange[2]), (ageRange[2], educationRange[1]), (ageRange[2], educationRange[2])],
        "Advance": [(ageRange[1], educationRange[3]), (ageRange[1], educationRange[4]), (ageRange[0], educationRange[4]), (ageRange[2], educationRange[3]), (ageRange[2], educationRange[4])]
    }

    if int(session['age']) < 18:
        age = ageRange[0]
    elif int(session['age']) >= 18 and int(session['age']) <40:
        age = ageRange[1]
    else:
        age = ageRange[2]

    education = session['education']
    
    pair = (age, education)
    for key, value in combinations.items():
        if pair in value:
            return key
    
    return 'Beginner'

@app.route('/level', methods=["GET", "POST"])
def level():
    if universal_login_condition():
        if request.method == "POST":
            level = request.args.get('level')

            if not level:
                context = {
                    "message": "Please add level via POST to proceed!",
                    "logout": "http://127.0.0.1:5000/logout" ,
                    "main_page": "http://127.0.0.1:5000" 
                }
                return jsonify(context)

            try:
                doc_ref = db.collection(u'users').document(session['email'])
                doc_ref.set({
                    u'level': level,
                }, merge=True)

                return redirect('/welcome')
            except:
                context={
                    "error": "Could not write level!"
                }
                return jsonify(context)
        else:
            if 'level' in session:
                your_level = session['level']
            suggested_level = suggest_level()
            context = {
                "your-level": your_level,
                "suggested-level": suggested_level,
                "apply-suggested-level": f"http://127.0.0.1:5000/level?level={suggested_level}"
            }
            return jsonify(context)
    else:
        return redirect('/')

@app.route('/deleteAccount/<email>', methods=["GET", "POST"])
def deleteAccount(email):
    if universal_login_condition():
        if 'email' in session:
            if session['email'] == email:
                if request.method == "POST":
                    pwd = request.args.get('password')
                    data = db.collection(u'users').document(email).get().to_dict()
                    if not data:
                        context = {"error": "User does not exist!"}
                        return jsonify(context)
                    
                    if bcrypt.check_password_hash(data['password'], pwd):
                        try:
                            db.collections(u'users').document(email).delete()
                            return redirect('/logout')
                        except:
                            context = {"error": "Database service is down at the moment!"}
                            return jsonify(context)
                    else:
                        context = {"error": "Wrong password input!"}
                        return jsonify(context)
                else:
                    context = {
                        "message": "To delete your account, send a POST request with your password!",
                        "logout": "http://127.0.0.1:5000/logout",
                        "main_page": "http://127.0.0.1:5000" 
                    }
                    return jsonify(context)

            else:
                context = {
                    "error": "User email address does not match!"
                }
        else:
            redirect('/logout')
    else:
        return redirect('/')

def sentence_matching(query):
    tf.compat.v1.disable_eager_execution()
    def embed_useT(module):
        with tf.Graph().as_default():
            sentences = tf.compat.v1.placeholder(tf.string)
            embed = hub.Module(module)
            embeddings = embed(sentences)
            session = tf.compat.v1.train.MonitoredSession()
        return lambda x: session.run(embeddings, {sentences: x})
    embed_fn = embed_useT('model')
    encoding_matrix = embed_fn(query)
    return np.inner(encoding_matrix, encoding_matrix)

@app.route('/compareSentences', methods=["GET", "POST"])
def compareSentences():
    if universal_login_condition():
        if request.method == "POST":
            word = request.args.get('word')
            input = request.args.get('sentence')
            api = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
            r = requests.get(url=api)
            meaningDict = r.json()
            meaning = [input]
            for objects in meaningDict[0]['meanings'][0]['definitions']:
                meaning.append(objects['definition'])

            corr_mat = sentence_matching(meaning)
            result = corr_mat[0][:]
            context = {}
            for i in range(1, len(meaning)):
                context[meaning[i]] = str(result[i])

            print(context)

            return jsonify(context)
        else:
            context = {
                "message": "To compare sentences, send a POST request",
                "logout": "http://127.0.0.1:5000/logout",
                "main_page": "http://127.0.0.1:5000" 
            }
    else:
        return redirect('/')


if __name__ == "__main__": 
    app.run(debug=True)