# 🐾 Pet Adoption & Rescue Platform

A full-stack web application that connects pets in need of a home with people who want to adopt them. Users can explore available pets, search and filter listings, save favorites, submit adoption requests, and track their application status. Administrators can manage pets and adoption requests through Django Admin.


## ✨ Features

### 👤 Authentication & User Profile
- User registration, login, and logout
- Authenticated user profile viewing and editing
- Protected features for authenticated users

### 🐶 Pet Management & Browsing
- Browse available pets with images and details
- View pet name, animal type, breed, age, gender, location, description, and adoption status
- Dedicated pet details view
- Responsive pet cards and navigation

### 🔍 Search & Filtering
- Search pets by name and other supported search fields
- Filter pets by animal type, breed, gender, location, and adoption status
- Display matching results based on search and filter criteria

### ❤️ Favorite Pets
- Add pets to favorites
- View and manage saved favorite pets

### 📝 Adoption Requests
- Submit adoption requests for available pets
- Provide address, phone number, reason for adoption, previous pet experience, and an optional message
- View personal adoption request history
- Track request statuses: Pending, Approved, and Rejected

### 🛡️ Adoption Business Logic
- Only available pets can receive new adoption requests
- Prevent duplicate active adoption requests from the same user for the same pet
- When an application is approved, the pet's status changes to Adopted
- Prevent further adoption applications for adopted pets
- Users can access only their own adoption requests through the API

### 🔧 Django Administration
- Add, edit, and delete pet listings
- Upload and manage pet images
- Update pet adoption status
- View adoption requests and applicant information
- Approve or reject adoption applications

### 🌐 REST API
- Django REST Framework API for pets and adoption requests
- API authentication and permission controls
- Search and filtering support
- User-specific adoption request access
- API pagination, if enabled in the project configuration

## 🛠️ Technology Stack

**Backend**
- Python
- Django
- Django REST Framework

**Frontend**
- React
- JavaScript
- HTML5
- CSS3

**Database**
- Django-configured database

**Authentication**
- Implemented authentication and permission system

## 📂 Project Structure

```text
pet-adoption-rescue-platform/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── project_config/
│   ├── pets/
│   ├── adoptions/
│   ├── accounts/
│   └── ...
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   └── ...
└── README.md
```

*Note: Replace example directory and app names with the actual names used in your repository.*

## ⚙️ Installation & Setup

### Prerequisites

- Python 3
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd pet-adoption-rescue-platform
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Set Up the Django Backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment.

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Configure any required environment variables and database settings before proceeding.

### 3. Apply Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

Migration files should be included in the repository. Normally, `makemigrations` is only necessary when model changes have not yet been captured in migration files.

### 4. Create an Admin Account

```bash
python manage.py createsuperuser
```

Follow the prompts to create an administrator account.

### 5. Start the Backend Server

```bash
python manage.py runserver
```

The default local development server address is:

`http://127.0.0.1:8000/`

Django Admin:

`http://127.0.0.1:8000/admin/`

### 6. Set Up the React Frontend

Open another terminal and navigate to the frontend directory from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL shown in the terminal.

Make sure the frontend API base URL matches the backend server address and that the backend allows requests from the frontend origin.

## 🌐 API Endpoints

### Pet API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pets/` | List pets |
| GET | `/api/pets/<id>/` | Retrieve pet details |
| POST | `/api/pets/` | Create a pet, subject to permissions |
| PUT | `/api/pets/<id>/` | Update a pet, subject to permissions |
| DELETE | `/api/pets/<id>/` | Delete a pet, subject to permissions |

### Adoption API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/adoptions/` | List the authenticated user's adoption requests |
| POST | `/api/adoptions/` | Submit an adoption request |
| GET | `/api/adoptions/<id>/` | Retrieve an authorized adoption request |
| PUT | `/api/adoptions/<id>/` | Update a request, subject to permissions |

### Search & Filtering Examples

```text
GET /api/pets/?search=golden
GET /api/pets/?animal_type=Dog
GET /api/pets/?gender=Male
GET /api/pets/?page=2
```

The availability of individual filters and pagination depends on the configured API implementation.

*Important: Verify endpoint paths and supported HTTP methods against the project's actual URL configuration and permissions before publishing this section.*

## 🗄️ Database Models

### Pet

Stores pet information, including name, animal type, breed, age, gender, location, description, image, adoption status, and creation date.

### AdoptionRequest

Stores the requesting user, selected pet, address, phone number, reason for adoption, previous pet experience, optional message, application status, and creation date.

### Relationships

- One user can submit multiple adoption requests.
- One pet can receive multiple adoption requests.
- Each adoption request is associated with a user and a pet.

## 🔒 Security & Permissions

- Authentication is required for protected user actions.
- Adoption requests are restricted to their owners where applicable.
- Pet management operations are protected according to the configured permissions.

## 📱 Responsive Design

The frontend is designed to provide a usable experience across desktop, laptop, tablet, and mobile screen sizes.

## 👩‍💻 Author

**Your Name**

- GitHub: [Your GitHub Profile](https://github.com/rabeyasumi)
- Project Repository: [Pet Adoption & Rescue Platform](<https://github.com/rabeyasumi/pet-adoption-rescue-platform>)

## 📄 License

This project was developed for educational and portfolio purposes.