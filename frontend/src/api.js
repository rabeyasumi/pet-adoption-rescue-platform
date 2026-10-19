
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('authToken');

  headers.set('Accept', 'application/json');

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      (typeof data === 'object'
        ? Object.values(data).flat().join(' ')
        : data) ||
      `Request failed: ${response.status}`;

    throw new Error(message);
  }

  return data;
}

// Pets
export function getPets(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value != null) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return apiRequest(
    `/pets/${queryString ? `?${queryString}` : ''}`
  );
}

export function getPet(id) {
  return apiRequest(`/pets/${id}/`);
}

// Authentication
export function registerUser(userData) {
  return apiRequest('/accounts/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials) {
  return apiRequest('/accounts/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function logoutUser() {
  return apiRequest('/accounts/logout/', {
    method: 'POST',
  });
}

export function getProfile() {
  return apiRequest('/accounts/profile/');
}

export function updateProfile(profileData) {
  return apiRequest('/accounts/profile/', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  })
}


// Adoption requests
export function getMyAdoptions() {
  return apiRequest('/adoptions/');
}

export function createAdoptionRequest(adoptionData) {
  return apiRequest('/adoptions/', {
    method: 'POST',
    body: JSON.stringify(adoptionData),
  });
}

export function getAdoptionRequest(id) {
  return apiRequest(`/adoptions/${id}/`);
}

 // Favorites
export function getFavorites() {
  return apiRequest('/pets/favorites/');
}

export function addFavorite(favoriteData) {
  return apiRequest('/pets/favorites/', {
    method: 'POST',
    body: JSON.stringify(favoriteData),
  });
}

export function removeFavorite(favoriteId) {
  return apiRequest(`/pets/favorites/${favoriteId}/`, {
    method: 'DELETE',
  });
}


// Admin pet management
export function createPet(petData) {
  return apiRequest('/pets/create/', {
    method: 'POST',
    body: petData instanceof FormData
      ? petData
      : JSON.stringify(petData),
  });
}

export function updatePet(id, petData) {
  return apiRequest(`/pets/${id}/manage/`, {
    method: 'PUT',
    body: petData instanceof FormData
      ? petData
      : JSON.stringify(petData),
  });
}

export function deletePet(id) {
  return apiRequest(`/pets/${id}/manage/`, {
    method: 'DELETE',
  });
}
export function submitAdoptionRequest(adoptionData) {
  return apiRequest('/adoptions/', {
    method: 'POST',
    body: JSON.stringify(adoptionData),
  })
}
export function getMyAdoptionRequests() {
  return apiRequest('/adoptions/');
}