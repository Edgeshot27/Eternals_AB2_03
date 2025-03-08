from fastapi import FastAPI, HTTPException, status, Depends, Query
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import logging
from patient_retriver import generate_patient_ai_response
logging.basicConfig(level=logging.ERROR)
from retrival import generate_ai_response

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Allow requests from your React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
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
SECRET_KEY = "your-secret-key"  # Replace with a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models
class User(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None

class UserInDB(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Patient(BaseModel):
    name: str
    age: int
    condition: str

class PatientCreate(BaseModel):
    id: int
    name: str
    gender: str
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
    latest_risk_factor:str
    score:float

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Helper functions
def user_helper(user) -> dict:
    """Helper function to format user data."""
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "phone_number": user.get("phone_number"),
    }

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify if the plain password matches the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from the JWT token."""
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
    return user

# Routes
@app.post("/signup/", response_model=UserInDB)
async def create_user(user: User):
    """Endpoint to create a new user."""
    user_dict = user.dict()
    # Hash the password before storing it
    user_dict["password"] = get_password_hash(user_dict["password"])
    # Check if user already exists
    if await users_collection.find_one({"email": user_dict["email"]}):
        raise HTTPException(status_code=400, detail="Email already registered")
    # Insert new user
    new_user = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return user_helper(created_user)

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    """Endpoint to authenticate a user."""
    # Find the user by email
    user_data = await users_collection.find_one({"email": user.email})
    if not user_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    # Verify the password
    if not verify_password(user.password, user_data["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    # Create an access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/user", response_model=UserInDB)
async def get_current_user_data(current_user: User = Depends(get_current_user)):
    """Endpoint to get the current user's data."""
    return user_helper(current_user)

@app.get("/patients", response_model=List[Patient])
async def get_patients():
    """Endpoint to get all patients."""
    patients = await patients_collection.find().to_list(1000)
    return patients

@app.post("/create")
async def create_patient(patient: PatientCreate):
    """Endpoint to create a new patient."""
    try:
        # Convert Pydantic model to dictionary
        patient_dict = patient.dict()
        # Insert the patient into the MongoDB collection
        result = await patients_collection.insert_one(patient_dict)
        if result.inserted_id:
            return {"message": "Patient created successfully", "patient_id": str(result.inserted_id)}
        else:
            raise HTTPException(status_code=500, detail="Failed to create patient")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/query/")
def query_medical_ai(question: str):
    try:
        response=generate_ai_response(question)
        
        return {"query": question, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/query_patient/")
async def query_medical_patient_ai(question: str, patient_id: str):
    try:
        # Retrieve patient details from MongoDB
        patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        
        patient_info = {
            "name": patient["name"],
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

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)