from fastapi import FastAPI, HTTPException, status, Depends, Request, Query
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.responses import RedirectResponse
import logging
from starlette.middleware.sessions import SessionMiddleware
import os
import base64
import uuid
from retrival import generate_ai_response
logging.basicConfig(level=logging.ERROR)
from patient_retriver import generate_patient_ai_response
import yagmail 
# Generate a secure secret key
def generate_secret_key():
    return base64.urlsafe_b64encode(os.urandom(32)).decode()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SENDER_EMAIL = "kotkarprasanna96@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "zoya pqwr tvgt wken"  # Use an App Password for security
# Add SessionMiddleware
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", generate_secret_key()),  # Use a secure secret key
    session_cookie="session",
)

# MongoDB connection
MONGO_DETAILS = "mongodb+srv://prajwal2403:Mysql321@prajwal2403.s8a1j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.myFirstDatabase
users_collection = database.get_collection("users")
patients_collection = database.get_collection("patients")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = generate_secret_key()  # Use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Google OAuth2 configuration
config_data = {
    "GOOGLE_CLIENT_ID": "687622613663-rbhdtl8uv86nl2galgnab1gjbr9p6mjc.apps.googleusercontent.com",
    "GOOGLE_CLIENT_SECRET": "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",
    "GOOGLE_REDIRECT_URI": "http://localhost:8000/auth/google/callback"
}
config = Config(environ=config_data)
oauth = OAuth(config)
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_id=config_data["GOOGLE_CLIENT_ID"],
    client_secret=config_data["GOOGLE_CLIENT_SECRET"],
    redirect_uri=config_data["GOOGLE_REDIRECT_URI"],
    client_kwargs={
        "scope": "openid email profile",
        "prompt": "select_account"
    }
)

# Pydantic models (unchanged)
class User(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None
    doctor_id: str  # Changed from Optional[str] to required str

class UserInDB(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    doctor_id: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Patient(BaseModel):
    id: str = Field(alias="_id")
    name: str
    gender: str
    condition: str
    description: str
    doctor_id: str
    age: int
    
class PatientCreate(BaseModel):
    name: str
    gender: str
    Email: EmailStr
    age: int
    dob: str
    temperature: float
    pulse: int
    bloodPressure: str
    height: float
    weight: float
    condition: str
    description: str
    symptoms: str
    personalHistory: str
    familyHistory: str
    allergies: str
    medications: str
    reports: str
    remarks: str
    latest_risk_factor: str
    score: str


class TokenData(BaseModel):
    email: Optional[str] = None

# Helper functions (unchanged)
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "phone_number": user.get("phone_number"),
        "doctor_id": user.get("doctor_id")
    }

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = await users_collection.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception

    # Check if doctor_id exists, if not, generate one and update user
    if "doctor_id" not in user or not user["doctor_id"]:
        doctor_id = f"DOC{uuid.uuid4().hex[:6].upper()}"
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"doctor_id": doctor_id}}
        )
        user["doctor_id"] = doctor_id

    return user

# Google OAuth2 routes
@app.get("/auth/google")
async def login_via_google(request: Request):
    redirect_uri = config_data["GOOGLE_REDIRECT_URI"]
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google/callback")
async def google_callback(request: Request):
    try:
        # Fetch the access token from Google
        token = await oauth.google.authorize_access_token(request)
        if not token:
            raise HTTPException(status_code=400, detail="Failed to fetch access token")

        # Log the token for debugging purposes
        logging.error(f"Token received: {token}")

        # Get user info directly from userinfo endpoint instead of parsing id_token
        userinfo = token.get('userinfo')
        if not userinfo:
            # If userinfo is not directly available, fetch it using the access token
            resp = await oauth.google.get('https://openidconnect.googleapis.com/v1/userinfo', token=token)
            userinfo = await resp.json()
            
        # Log the user info for debugging
        logging.error(f"User info: {userinfo}")

        # Extract user information
        email = userinfo.get("email")
        first_name = userinfo.get("given_name")
        last_name = userinfo.get("family_name")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found in user info")

        # Check if the user already exists in the database
        user = await users_collection.find_one({"email": email})
        if not user:
            # Create a new user if they don't exist
            user_data = {
                "first_name": first_name or "Google",
                "last_name": last_name or "User",
                "email": email,
                "password": "",  # No password for OAuth users
                "doctor_id": f"DOC{uuid.uuid4().hex[:6].upper()}"  # Generate doctor ID for Google users
            }
            await users_collection.insert_one(user_data)

        # Generate a JWT token for the user
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": email}, expires_delta=access_token_expires)

        # Redirect to the frontend with the JWT token
        frontend_url = f"http://localhost:5173/auth/google/callback?access_token={access_token}"  # Replace with your frontend URL
        return RedirectResponse(url=frontend_url)

    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"Error in google_callback: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Existing routes (unchanged)
@app.post("/signup/", response_model=UserInDB)
async def create_user(user: User):
    user_dict = user.dict()
    # Generate unique doctor ID
    user_dict["doctor_id"] = f"DOC{uuid.uuid4().hex[:6].upper()}"
    user_dict["password"] = get_password_hash(user_dict["password"])
    if await users_collection.find_one({"email": user_dict["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return user_helper(created_user)

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    user_data = await users_collection.find_one({"email": user.email})
    if not user_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not verify_password(user.password, user_data["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/user", response_model=UserInDB)
async def get_current_user_data(current_user: User = Depends(get_current_user)):
    """Endpoint to get the current user's data."""
    return user_helper(current_user)

@app.get("/patients", response_model=List[Patient])
async def get_patients(current_user: User = Depends(get_current_user)):
    """Get patients for the current doctor only."""
    try:
        doctor_id = current_user.get("doctor_id")
        if not doctor_id:
            # Generate a new doctor_id if missing
            doctor_id = f"DOC{uuid.uuid4().hex[:6].upper()}"
            await users_collection.update_one(
                {"_id": current_user["_id"]},
                {"$set": {"doctor_id": doctor_id}}
            )
            current_user["doctor_id"] = doctor_id

        patients = await patients_collection.find({"doctor_id": doctor_id}).to_list(1000)
        for patient in patients:
            patient["_id"] = str(patient["_id"])
        return patients
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching patients: {str(e)}")

@app.post("/create")
async def create_patient(patient: PatientCreate, current_user: dict = Depends(get_current_user)):
    """Endpoint to create a new patient."""
    try:
        # Convert Pydantic model to dictionary
        patient_dict = patient.dict()
        patient_dict["doctor_id"] = current_user["doctor_id"]
        # Insert the patient into the MongoDB collection
        result = await patients_collection.insert_one(patient_dict)
        if result.inserted_id:
            return {"message": "Patient created successfully", "patient_id": str(result.inserted_id)}
        else:
            raise HTTPException(status_code=500, detail="Failed to create patient")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))     

@app.get("/patient/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str, current_user: User = Depends(get_current_user)):
    """Endpoint to get a patient's complete information by ID."""
    try:
        patient = await patients_collection.find_one({
            "_id": ObjectId(patient_id),
            "doctor_id": current_user["doctor_id"]
        })
        if patient:
            patient["_id"] = str(patient["_id"])
            return patient
        else:
            raise HTTPException(status_code=404, detail="Patient not found or unauthorized access")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.get("/query")
# async def query_chat(req: str = Query(...)):
#     """Endpoint to handle chatbot queries."""
#     # Parse the query parameters
#     query_data = eval(req)  # Convert string to dictionary
#     patient_id = query_data.get("id")
#     prompt = query_data.get("prompt")

#     # Simulate a chatbot response
#     response = f"Bot response for patient {patient_id}: {prompt}"
#     return {"Output": response}

# @app.get("/query/")
# @app.get("/query/")
# async def query(question: str = Query(..., title="User Question")):
#     try:
#         response = generate_ai_response(question)
#         return {"answer": response}
#     except Exception as e:
#         logging.error(f"Error occurred: {str(e)}")
#         traceback.print_exc()  # Print detailed error
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# class QueryRequest(BaseModel):
#     question: str

# @app.get("/query/")
# def query(request: QueryRequest):
#     return {"question": request.question}

@app.get("/query/")
def query_medical_ai(question: str):
    try:
        # Simulate AI response generation
        response = generate_ai_response(question)
        return {"query": question, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.get("/query_patient/")
# async def query_medical_patient_ai(question: str, patient_id: str):
#     try:
#         # Retrieve patient details from MongoDB
#         patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
#         if not patient:
#             raise HTTPException(status_code=404, detail="Patient not found")

        
#         patient_info = {
#             "name": patient["name"],
#             "age": patient["age"],
#             "gender": patient["gender"],
#             "Email": patient["Email"],
#             "condition": patient["condition"],
#             "symptoms": patient["symptoms"],
#             "medications": patient["medications"],
#             "allergies": patient["allergies"],
#             "personalHistory": patient["personalHistory"],
#             "familyHistory": patient["familyHistory"],
#             "remarks": patient["remarks"]
#         }
#         past_questions = patient.get("therapeutic_optimisation_question", "").split(" || ")
#         past_questions = past_questions[-2:] if past_questions else []
#         therapeutic_optimisation_question = " || ".join(past_questions + [question])
#         response = generate_patient_ai_response(question, patient_info, therapeutic_optimisation_question)

#         # Generate AI response
#         response,score,risk_factor = generate_patient_ai_response(question, patient_info,therapeutic_optimisation_question)
#         chat_entry = {
#             "question": question,
#             "response": response,
#             "risk_factor": risk_factor,  
#             "confidence_score": score,
#             "timestamp": datetime.utcnow()
#         }
#         await patients_collection.update_one(
#             {"_id": ObjectId(patient_id)},
#             {"$push": {"chat_history": chat_entry}, "$set": {"therapeutic_optimisation_question": therapeutic_optimisation_question, 
#               "latest_risk_factor": risk_factor}}
#         )
        
#         return {"query": question, "patient_info": patient_info, "response": response,"score":score}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.get("/query_patient/")
async def query_medical_patient_ai(question: str, patient_id: str):
    try:
        # Retrieve patient details from MongoDB
        patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        
        patient_info = {
            "name": patient["name"],
            "Email":patient["Email"],
            "age": patient["age"],
            "gender": patient["gender"],
            "condition": patient["condition"],
            "symptoms": patient["symptoms"],
            "medications": patient["medications"],
            "allergies": patient["allergies"],
            "personalHistory": patient["personalHistory"],
            "familyHistory": patient["familyHistory"],
            "remarks": patient["remarks"],
            "score":patient.get("score",0.0),
            "latest_risk_factor":patient["latest_risk_factor"]
        }
        past_questions = patient.get("therapeutic_optimisation_question", "").split(" || ")
        past_questions = past_questions[-2:] if past_questions else []
        therapeutic_optimisation_question = " || ".join(past_questions + [question])
        response = generate_patient_ai_response(question, patient_info, therapeutic_optimisation_question)

        # Generate AI response
        result = generate_patient_ai_response(question, patient_info, therapeutic_optimisation_question)

# Ensure it's unpackable
        if isinstance(result, tuple) and len(result) == 3:
            response, risk, cscore = result
            
        else:
            response = result
            risk, cscore = None, None
        # print(risk)
        # print(result)
        # if risk and risk.lower() == "critical":
        #     send_risk_alert_email(patient_info)
        # else:
        #     print("no call")
        if risk and risk.lower() == "critical":
            send_risk_alert_email(patient_info)
        chat_entry = {
            "question": question,
            "response": response,
            "latest_risk_factor":risk,
            "score":cscore,
            "timestamp": datetime.utcnow()
        }
        await patients_collection.update_one(
            {"_id": ObjectId(patient_id)},
            {"$push": {"chat_history": chat_entry}, "$set": {"therapeutic_optimisation_question": therapeutic_optimisation_question,"latest_risk_factor":risk,"score":cscore}}
        )
        
        return {"query": question, "patient_info": patient_info, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def send_risk_alert_email(patient:dict):
    """
    Sends an email alert if the latest risk factor is 'critical'.
    """
    if patient.get("latest_risk_factor", "").lower() != "critical":
        print(f"✅ {patient.get('name', '')} is not in a critical condition. No email sent.")
        return {"message": f"No alert needed for {patient.get('name', '')}."}

    subject = f"🚨 Urgent Medical Risk Alert for {patient.get('name', '')}"

    body = f"""
    Dear {patient.get("name", "")},

    Our latest health analysis has flagged your condition as *CRITICAL*.
   
    📌 *Risk Assessment Summary:*
    - *Risk Level:* {patient.get('latest_risk_factor','')}
    - *Condition:* {patient.get('condition','')}
    - *Symptoms:* {patient.get('symptoms','')}
    - *Recommended Action:* Please seek immediate medical attention.

    Regards,
    Your Healthcare Team
    """

    try:
        yag = yagmail.SMTP(SENDER_EMAIL, SENDER_PASSWORD)
        yag.send(to=patient.get("Email",""), subject=subject, contents=body)
        print(f"📧 Alert email sent to {patient.get('Email','')}")
        return {"message": f"Alert email sent to {patient.get('name','')} at {patient.get('Email','')}."}
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return {"error": "Failed to send email", "details": str(e)}
# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)