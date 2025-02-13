from fastapi import FastAPI, UploadFile, File, Form,HTTPException
import cv2
import numpy as np
import face_recognition
import os
import tempfile
import urllib.request
import cv2
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore, storage
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

cred = credentials.Certificate(r"C:\Users\okash\Downloads\FYP Ladies\attendance-56f80-firebase-adminsdk-do6tp-06244bb9fd.json")
firebase_admin.initialize_app(cred,{'storageBucket': 'attendance-56f80.appspot.com'})
db= firestore.client()
bucket = storage.bucket()
app = FastAPI()

origins = [
    "http://localhost:3000",  
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentData(BaseModel):
    userId: str
    name: str
    department: str
    registrationNo: str
    userType: str
    


directory = r"C:\Users\okash\Downloads\FYP Ladies\images"
url = "http://192.168.100.31:8080/photo.jpg"
save_path = "downloaded_images"
save_path1 = "downloaded_images1"
save_path2="downloaded_images2"
data={
    "Name":"",
    "registrationNo":"",
    "userType": "",
    "department":"",
    "image_url": None,
    "time":None
}
ImageFinal={"image_url": None,}

def save_and_show_image(url, save_path):
  
  os.makedirs(save_path, exist_ok=True) 
  global full_save_path
  timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
  filename = f"uploaded_image_{timestamp}.jpg"
  full_save_path = os.path.join(save_path, filename)
  global img
  try:
      imgRes = urllib.request.urlopen(url)
      imgNp = np.array(bytearray(imgRes.read()), dtype=np.uint8)
      img = cv2.imdecode(imgNp, -1)
      cv2.imwrite(full_save_path, img)
      blob = bucket.blob(filename)
      blob.upload_from_filename(full_save_path)
      blob.make_public()
      data['image_url'] = blob.public_url
      data['time']=timestamp
      
      print(f"Image saved successfully to: {full_save_path}")
      print(f"Image URL: {data['image_url']}")

  except Exception as e:
      print(f"Error downloading or processing image: {e}")
      
def save_and_show_image1(url, save_path):
  
  os.makedirs(save_path, exist_ok=True) 
  global full_save_path
  timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
  filename = f"uploaded_image_{timestamp}.jpg"
  full_save_path = os.path.join(save_path, filename)
  global img
  try:
      imgRes = urllib.request.urlopen(url)
      imgNp = np.array(bytearray(imgRes.read()), dtype=np.uint8)
      img = cv2.imdecode(imgNp, -1)
      cv2.imwrite(full_save_path, img)
      blob = bucket.blob(filename)
      blob.upload_from_filename(full_save_path)
      blob.make_public()
      data['image_url'] = blob.public_url
      data['time']=timestamp
      data["userType"]="teacher"
      
      print(f"Image saved successfully to: {full_save_path}")
      print(f"Image URL: {data['image_url']}")

  except Exception as e:
      print(f"Error downloading or processing image: {e}")
      
      
def save_and_show_image2(url, save_path):
    os.makedirs(save_path, exist_ok=True)
    global full_save_path2
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"uploaded_image_{timestamp}.jpg"
    full_save_path2 = os.path.join(save_path, filename)
    global img
    try:
        imgRes = urllib.request.urlopen(url)
        imgNp = np.array(bytearray(imgRes.read()), dtype=np.uint8)
        img = cv2.imdecode(imgNp, -1)
        cv2.imwrite(full_save_path2, img)
        blob = bucket.blob(filename)
        blob.upload_from_filename(full_save_path2)
        blob.make_public()
        ImageFinal['image_url'] = blob.public_url
        ImageFinal['time'] = timestamp

        print(f"Image saved successfully to: {full_save_path2}")
        print(f"Image URL: {ImageFinal['image_url']}")

    except Exception as e:
        print(f"Error downloading or processing image: {e}")
      
def get_image_paths(directory):
    image_paths = []
    for filename in os.listdir(directory):
        if filename.endswith(('.jpg', '.png', '.JPG')): 
            image_path = os.path.join(directory, filename)
            image_paths.append(image_path)
    return image_paths


def faceEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList

def encodeStudent(image):
    print('encoding user')
    encodedUser = faceEncodings([image])[0]
    return encodedUser

def findStudent(encodedUser, imagePaths):
    print('inside the finding user')
    for imagePath in imagePaths:
        try:
            frame = cv2.imread(imagePath)
            if frame is None:
                print(f"Failed to load image: {imagePath}")
                continue
            faces = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
            print('frame is set')

            facesCurrentFrame = face_recognition.face_locations(faces)
            encodesCurrentFrame = face_recognition.face_encodings(faces, facesCurrentFrame)

            for encodeFace, faceLoc in zip(encodesCurrentFrame, facesCurrentFrame):
                print('matching face')
                matches = face_recognition.compare_faces([encodedUser], encodeFace)
                faceDis = face_recognition.face_distance([encodedUser], encodeFace)
                matchIndex = np.argmin(faceDis)

                if matches[matchIndex]:
                    return 1 
        except Exception as e:
            print(f"Error processing image {imagePath}: {e}")

    return 0


def count_faces_in_image(encodedUser, imagePaths):
    total_faces_found = 0
    matched_images = []

    for imagePath in imagePaths:
        frame = cv2.imread(imagePath)
        if frame is None:
            print(f"Failed to load image: {imagePath}")
            continue
        faces = cv2.resize(frame, (0, 0), None, 0.25, 0.25)

        face_locations = face_recognition.face_locations(faces)
        face_encodings = face_recognition.face_encodings(faces, face_locations)

        for encodeFace in face_encodings:
            matches = face_recognition.compare_faces([encodedUser], encodeFace)
            if True in matches:
                total_faces_found += 1
                matched_images.append(imagePath)

    path_components = [image_path.split(os.sep)[-1] for image_path in matched_images]
    print(total_faces_found, path_components)
    return total_faces_found, path_components

# @app.post("/mark_attendance")
# async def mark_attendace(image: UploadFile = File(...)):
#     try:
#         temp_file = tempfile.NamedTemporaryFile(delete=False)
#         temp_file.write(await image.read())
#         temp_file.close()

#         print(f"Temporary file created: {temp_file.name}")

#         testImage = encodeStudent(cv2.imread(temp_file.name))
#         print("Image encoding completed.")
#         image_paths = get_image_paths(directory)
#         rsult = findStudent(testImage, imagePaths=image_paths)
#         print("Student finding completed.")

#         os.unlink(temp_file.name)
#         print("Temporary file deleted.")

#         return {"message": "Success", "attendance": rsult}
#     except Exception as e:
#         print(f"Error processing request: {e}")
#         return {"message": "Error", "error": str(e)}

@app.post("/check_student")
async def check_student():
    save_and_show_image2(url, save_path2)
    try:
        image_url = ImageFinal['image_url']
        resp = urllib.request.urlopen(image_url)
        image_np = np.array(bytearray(resp.read()), dtype=np.uint8)
        testImage = cv2.imdecode(image_np, -1)
        encoded_user = encodeStudent(testImage)
        print("Image encoding completed.")

        image_paths = get_image_paths(directory)
        rslt, stds = count_faces_in_image(encoded_user, imagePaths=image_paths)
        print("Student Counting completed.")

        return {"message": "Success", "total": rslt, "students": stds}
    except Exception as e:
        print(f"Error processing request: {e}")
        return {"message": "Error", "error": str(e)}


    
@app.post("/runStudent")
async def execute(student: StudentData):
    save_and_show_image(url, save_path)
    try:
        image_url = data['image_url']
        resp = urllib.request.urlopen(image_url)
        image_np = np.array(bytearray(resp.read()), dtype=np.uint8)
        testImage = cv2.imdecode(image_np, -1)
        encoded_user = encodeStudent(testImage)
        print("Image encoding completed.")
        image_paths = get_image_paths(directory)
        result = findStudent(encoded_user, imagePaths=image_paths)
        print("Student finding completed.")

        # Assign the values to the global data dictionary
        data["Name"] = student.name
        data["registrationNo"] = student.registrationNo
        data["userType"] = student.userType
        data["department"] = student.department
        data["Present"] = 1 if result == 1 else 0

        doc_ref = db.collection('StudentandTeacherAttendance').document()
        doc_ref.set(data)
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {e}")

    return {"message": "Success"}

@app.post("/runTeacher")
async def execute_teacher(teacher: StudentData):
    save_and_show_image1(url, save_path1)
    try:
        image_url = data['image_url']
        resp = urllib.request.urlopen(image_url)
        image_np = np.array(bytearray(resp.read()), dtype=np.uint8)
        testImage = cv2.imdecode(image_np, -1)
        encoded_user = encodeStudent(testImage)
        print("Image encoding completed.")
        image_paths = get_image_paths(directory)
        result = findStudent(encoded_user, imagePaths=image_paths)
        print("Student finding completed.")

        # Assign the values to the global data dictionary
        data["Name"] = teacher.name
        data["registrationNo"] = teacher.registrationNo
        data["userType"] = teacher.userType
        data["department"] = teacher.department
        data["Present"] = 1 if result == 1 else 0

        doc_ref = db.collection('StudentandTeacherAttendance').document()
        doc_ref.set(data)
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {e}")

    return {"message": "Success"}