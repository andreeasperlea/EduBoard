# EduBoard 

**EduBoard** este o aplicație web modernă de tip **LMS (Learning Management System)**, concepută pentru a digitaliza și eficientiza interacțiunea dintre profesori și elevi. Platforma integrează unelte de colaborare vizuală (Whiteboard) și un asistent educațional bazat pe Inteligență Artificială (OpenAI). 


**Arhitectura Sistemului**

* **Frontend (Client):** Construit cu **React + Vite** (Single Page Application). Gestionează interfața cu utilizatorul și logica de afișare.
* **Backend (Server):** Construit cu **Python FastAPI**. Gestionează logica din spatele platformei, autentificarea și comunicarea cu baza de date.
* **Database:** **MongoDB** pentru stocarea flexibilă a datelor (documente JSON).
* **AI Service:** Integrare cu **OpenAI API** prin intermediul backend-ului.


### **Tehnologii utilizate:**


### **Frontend (Interfața Utilizator)**



* **React.js (v18)** - Librăria principală pentru UI.
* **TypeScript** - Pentru tipizare statică și prevenirea erorilor.
* **Vite** - Build tool performant pentru dezvoltare rapidă.
* **React** - Gestionarea rutelor și navigării.
* **CSS** - Stilizare


### **Backend (API & Server)**



* **Python 3.10+** - Limbajul de programare.
* **FastAPI** - Framework asincron de înaltă performanță pentru API-uri REST.
* **Beanie ODM** - Object Document Mapper asincron pentru MongoDB.
* **Pydantic** - Validarea datelor și definirea schemelor.
* **JWT (JSON Web Tokens)** - Autentificare securizată (Stateless).
* **OpenAI SDK** - Integrarea inteligenței artificiale.

**Baza de Date**

* **MongoDB** - Bază de date NoSQL
* **Uvicorn** - Server ASGI pentru rularea aplicației Python.


**Funcționalități Implementate**


### **1. Autentificare & Securitate**



* Înregistrare (Register) și Autentificare (Login) securizată.
* Hash-uirea parolelor folosind `passlib` și `bcrypt`.
* Generare și validare tokeni **JWT**.


### **2. Roluri Utilizatori (RBAC)**



* **Profesor:** Are drepturi administrative (creare clase, invitare elevi, gestionare table).
* **Student:** Are drepturi de vizualizare (accesare clase, chat AI).


### **3. Managementul Clasei**



* Creare clase noi (Nume, Descriere).
* Vizualizare portofoliu de clase.
* Sistem de invitație a studenților pe bază de email.


### **4. Interactive Whiteboard (Tabla Digitală)**



* Desenare liberă (Freehand drawing) pe canvas HTML5.
* Desenele sunt salvate automat în MongoDB ca vectori de coordonate.


### **5. Asistent AI (EduBoard AI)**



*  AI-ul este configurat să răspundă didactic, ca un profesor.
* Istoric al conversației în sesiunea curentă.

**Instrucțiuni pentru a rula**

Pentru a rula proiectul, urmați pașii de mai jos.


### **Cerințe Preliminare**



* **Node.js** (v16+)
* **Python** (v3.10+)
* Un cont **MongoDB**.
* O cheie API **OpenAI** .


### **Pasul 1: Configurare Backend**

Navigați în folderul pt server: 
\cd backend

1.Creați și activați mediul virtual:

python -m venv .venv


    # Windows: .venv\Scripts\activate


    # Mac/Linux: source .venv/bin/activate

2.Instalați dependențele: \
 \
pip install -r requirements.txt

3.Creați fișierul `.env` și adăugați configurările: \


MONGODB_URL=mongodb+srv://user:parola@cluster.mongodb.net/eduboard

SECRET_KEY=cheie_secret

OPENAI_API_KEY=sk-proj-... (tot cheia de la api)

4.Porniți serverul: \
 \
uvicorn app.main:app --reload


### **Pasul 2: Configurare Frontend**

1.Navigați în folderul clientului (într-un terminal nou):

cd frontend

2.Instalați pachetele Node:

npm install

3.Porniți aplicația React: \
 \
npm run dev

4. Deschideți browserul la adresa: <code>[http://localhost:5173](http://localhost:5173)</code>


## **Planuri de Viitor**

Funcționalități planificate pentru versiunea finală:

1.Posibilitatea ca elevii să încarce fișiere PDF/DOCX.

2.WebSockets pentru ca studenții să vadă ce desenează profesorul în timp real (fără refresh).	

3,Sistem de notare și calculare a mediilor.

4.Un AI mai interactiv și mai inteligent. 

5.Etc...
