# Pet Adoption & Rescue Platform

A web application that allows users to browse pets available for adoption and submit adoption requests. Administrators can manage pets and review adoption applications.

## Features

- User registration, login, logout, and profile
- Browse pets and view pet details
- Search and filter pets
- Submit adoption requests
- View personal adoption request history
- Prevent adoption requests for adopted pets
- Prevent duplicate active requests for the same pet
- Admin management of pets and adoption requests
- Django REST Framework API
- Favorite pets (if implemented)
## Live Demo

### YouTube Project Walkthrough

[![Pet Adoption & Rescue Platform - Live View]

[▶ Watch the Project on YouTube](https://youtu.be/zP4zvyS6b2M)
## Tech Stack

**Backend:** Python, Django, Django REST Framework  
**Frontend:** React, JavaScript, CSS  
**Database:** See the configured Django database settings  
**Authentication:** See the implemented authentication method

## Installation

1. Clone the repository.
2. Navigate to the backend directory.
3. Create and activate a Python virtual environment.
4. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Configure the environment variables and database settings.
6. Apply database migrations:

   ```bash
   python manage.py migrate
   ```

7. Start the Django development server:

   ```bash
   python manage.py runserver
   ```

8. For the React frontend, navigate to its directory, install the dependencies, and run the development server using the project's configured npm scripts.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/pets/` | List pets |
| GET | `/api/pets/<id>/` | View pet details |
| GET | `/api/adoptions/` | List the authenticated user's requests |
| POST | `/api/adoptions/` | Submit an adoption request |

Additional endpoints depend on the implemented URL configuration.

## Database Migrations

Migration files are maintained in each Django app's `migrations/` directory.

```bash
python manage.py makemigrations
python manage.py migrate
```

## Admin

Create an administrator account if needed:

```bash
python manage.py createsuperuser
```

Then visit `/admin/` while the Django server is running.

## Project Status

Developed as a Django and Django REST Framework project with a React frontend.