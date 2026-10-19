
import './App.css'
import './index.css'


import {
  getPets,
  getFavorites,
  addFavorite,
  removeFavorite,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  submitAdoptionRequest,
  getMyAdoptionRequests,
} from './api'


import heroDog from './assets/hero/hero-dog.png'

import dogIcon from './assets/categories/dog.png'
import catIcon from './assets/categories/cat.png'
import rabbitIcon from './assets/categories/rabbit.png'
import birdIcon from './assets/categories/bird.png'
import otherIcon from './assets/categories/other.png'

import dogPhoto from './assets/pets/dog-01.jpeg'
import catPhoto from './assets/pets/cat-01.jpeg'
import rabbitPhoto from './assets/pets/rabbit-01.jpeg'
import birdPhoto from './assets/pets/bird-01.jpeg'

import { useEffect, useState } from 'react'

const categories = [
  { name: 'Dogs', type: 'Dog', image: dogIcon },
  { name: 'Cats', type: 'Cat', image: catIcon },
  { name: 'Rabbits', type: 'Rabbit', image: rabbitIcon },
  { name: 'Birds', type: 'Bird', image: birdIcon },
  { name: 'Other', type: 'Other', image: otherIcon },
]

const pets = [
  { name: 'Buddy', type: 'Dog', age: '2 years', image: dogPhoto },
  { name: 'Luna', type: 'Cat', age: '1 year', image: catPhoto },
  { name: 'Charlie', type: 'Rabbit', age: '1 year', image: rabbitPhoto },
  { name: 'Rio', type: 'Bird', age: '1 year', image: birdPhoto },
]

function App() {
  const [pets, setPets] = useState([])
  const [petsLoading, setPetsLoading] = useState(true)
  const [petsError, setPetsError] = useState('')
  const [search, setSearch] = useState('')
  const [animalType, setAnimalType] = useState('')

  const [statistics, setStatistics] = useState(null)
  const [statsError, setStatsError] = useState('')

  const [favorites, setFavorites] = useState([])
  const [favoriteError, setFavoriteError] = useState('')
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const [userLocationName, setUserLocationName] = useState('')

  const [authMode, setAuthMode] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('authToken'))
  )
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })


const [profile, setProfile] = useState(null)
const [profileForm, setProfileForm] = useState({
  first_name: '',
  last_name: '',
  email: '',
})
const [profileError, setProfileError] = useState('')
const [profileMessage, setProfileMessage] = useState('')
const [profileEditing, setProfileEditing] = useState(false)
const [profileLoading, setProfileLoading] = useState(false)

const [selectedPet, setSelectedPet] = useState(null)
const [adoptionForm, setAdoptionForm] = useState({
  address: '',
  phone: '',
  reason: '',
  previous_pet_experience: '',
  message: '',
})

const [myAdoptionRequests, setMyAdoptionRequests] = useState([]);
const [adoptionRequestsLoading, setAdoptionRequestsLoading] = useState(false);
const [adoptionRequestsError, setAdoptionRequestsError] = useState('');

  useEffect(() => {
    let cancelled = false

    async function loadPets() {
      setPetsLoading(true)
      setPetsError('')

      try {
        const data = await getPets({
          search,
          animal_type: animalType,
        })

        if (!cancelled) {
          // Supports both normal lists and DRF pagination.
          setPets(Array.isArray(data) ? data : data.results ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          setPetsError(error.message || 'Could not load pets.')
        }
      } finally {
        if (!cancelled) {
          setPetsLoading(false)
        }
      }
    }

    loadPets()

    return () => {
      cancelled = true
    }
  }, [search, animalType])


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/pets/statistics/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load pet statistics')
        }
        return response.json()
      })
      .then((data) => setStatistics(data))
      .catch(() => {
        setStatsError('Statistics could not be loaded.')
      })
  }, [])
  const nearbyPets = userLocationName.trim()
  ? pets.filter((pet) =>
      pet.location
        ?.toLowerCase()
        .includes(userLocationName.trim().toLowerCase())
    )
  : pets

  const loadFavorites = async () => {
    const token = localStorage.getItem('authToken')

    if (!token) {
      setFavorites([])
      return
    }

    setFavoriteLoading(true)
    setFavoriteError('')

    try {
      const data = await getFavorites()
      setFavorites(Array.isArray(data) ? data : data.results ?? [])
    } catch (error) {
      setFavoriteError(error.message || 'Could not load favorites.')
    } finally {
      setFavoriteLoading(false)
    }
}
useEffect(() => {
    loadFavorites()
  }, [])
const isFavorite = (petId) => {
  return favorites.some((favorite) => {
    const favoritePetId =
      typeof favorite.pet === 'object'
        ? favorite.pet.id
        : favorite.pet

    return favoritePetId === petId
  })
}

const handleFavorite = async (pet) => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    setFavoriteError('Please log in to add favorites.')
    return
  }

  if (favoriteLoading) return

  setFavoriteError('')
  setFavoriteLoading(true)

  try {
    const existingFavorite = favorites.find((favorite) => {
      const favoritePetId =
        typeof favorite.pet === 'object'
          ? favorite.pet.id
          : favorite.pet

      return favoritePetId === pet.id
    })

    if (existingFavorite) {
      await removeFavorite(existingFavorite.id)
      setFavorites((previous) =>
        previous.filter(
          (favorite) => favorite.id !== existingFavorite.id
        )
      )
    } else {
      await addFavorite({ pet: pet.id })
      await loadFavorites()
    }
  } catch (error) {
    setFavoriteError(
      error.message || 'Could not update favorites.'
    )
  } finally {
    setFavoriteLoading(false)
  }
}

const handleAuthChange = (event) => {
  const { name, value } = event.target

  setAuthForm((previous) => ({
    ...previous,
    [name]: value,
  }))
}

const handleAuthSubmit = async (event) => {
  event.preventDefault()

  setAuthError('')
  setAuthMessage('')
  setAuthLoading(true)

  try {
    if (authMode === 'signup') {
      await registerUser(authForm)

      setAuthMode('login')
      setAuthForm((previous) => ({
        ...previous,
        password: '',
      }))
      setAuthMessage('Account created successfully. Please log in.')
      return
    }

    const data = await loginUser({
      username: authForm.username,
      password: authForm.password,
    })

    localStorage.setItem('authToken', data.token)
    setIsLoggedIn(true)
    setAuthMode('')
    setAuthForm((previous) => ({
      ...previous,
      password: '',
    }))

    setAuthMessage('Login successful! Welcome to PetAdopt.')
    try {
      const profileData = await getProfile()
      setProfile(profileData)
    } catch (error) {
      setProfileError(error.message || 'Could not load profile.')
    }
    const favoritesData = await getFavorites()
    setFavorites(
      Array.isArray(favoritesData)
        ? favoritesData
        : favoritesData.results ?? []
    )
  } catch (error) {
    setAuthError(error.message || 'Authentication failed.')
  } finally {
    setAuthLoading(false)
  }
}

const handleOpenProfile = async () => {
  setProfileError('');
  setProfileMessage('');
  setProfileEditing(false);
  setProfileLoading(true);

  setAdoptionRequestsLoading(true);
  setAdoptionRequestsError('');

  setAuthMode('profile');

  try {
    const data = await getProfile();

    setProfile(data);
    setProfileForm({
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
    });
  } catch (error) {
    setProfileError(error.message || 'Could not load profile.');
  } finally {
    setProfileLoading(false);
  }

  try {
  const response = await getMyAdoptionRequests();

  console.log('Adoption API response:', response);

  setMyAdoptionRequests(
    Array.isArray(response)
      ? response
      : Array.isArray(response?.results)
        ? response.results
        : []
  );
} catch (error) {
  setAdoptionRequestsError(
    error.message || 'Could not load adoption requests.'
  );
} finally {
  setAdoptionRequestsLoading(false);
}
};


const handleSaveProfile = async (event) => {
  event.preventDefault()
  setProfileError('')
  setProfileMessage('')
  setProfileLoading(true)

  try {
    const data = await updateProfile(profileForm)

    setProfile(data)
    setProfileForm({
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
    })

    setProfileEditing(false)
    setProfileMessage('Profile updated successfully!')
  } catch (error) {
    setProfileError(error.message || 'Could not update profile.')
  } finally {
    setProfileLoading(false)
  }
}
const handleAdoptionChange = (event) => {
  const { name, value } = event.target

  setAdoptionForm((previous) => ({
    ...previous,
    [name]: value,
  }))
}

const [adoptionLoading, setAdoptionLoading] = useState(false)
const [adoptionError, setAdoptionError] = useState('')
const [adoptionMessage, setAdoptionMessage] = useState('')

const handleAdoptionSubmit = async (event) => {
  event.preventDefault()

  if (!selectedPet || adoptionLoading) return

  setAdoptionError('')
  setAdoptionMessage('')
  setAdoptionLoading(true)

  try {
    await submitAdoptionRequest({
      pet: selectedPet.id,
      address: adoptionForm.address,
      phone: adoptionForm.phone,
      reason: adoptionForm.reason,
      previous_pet_experience: adoptionForm.previous_pet_experience,
      message: adoptionForm.message,
    })

    setAdoptionMessage(
      `Your adoption request for ${selectedPet.name} was submitted successfully!`
    )

    setAdoptionForm({
      address: '',
      phone: '',
      reason: '',
      previous_pet_experience: '',
      message: '',
    })
  } catch (error) {
    setAdoptionError(
      error.message || 'Could not submit the adoption request.'
    )
  } finally {
    setAdoptionLoading(false)
  }
}

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span>PetAdopt</span>
        </a>

        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#pets">Explore Pets</a>
          <a href="#categories">Categories</a>
          <a href="#favorites">Favorites</a>
        </nav>

        
      <div className="nav-actions">
        {isLoggedIn ? (
          <>
          <button
            className="login-btn"
            onClick={async () => {
              try {
                await logoutUser()
              } catch (error) {
                console.error('Logout API error:', error)
              } finally {
                localStorage.removeItem('authToken')
                setIsLoggedIn(false)
                setFavorites([])
                setAuthMessage('You have logged out.')
                setAuthError('')
                setAuthMode('')
              }
            }}
          >
            Logout
          </button>
           <button
            className="login-btn"
            onClick={handleOpenProfile}
            disabled={profileLoading}
          >
            My Profile
          </button>
          </>
        ) : (
          <>
            <button
              className="login-btn"
              onClick={() => {
                setAuthMode('login')
                setAuthError('')
                setAuthMessage('')
              }}
            >
              Login
            </button>

            <button
              className="signup-btn"
              onClick={() => {
                setAuthMode('signup')
                setAuthError('')
                setAuthMessage('')
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      </header>



      {authMode && (
        <div
          className="auth-modal-overlay"
          onClick={() => setAuthMode('')}
        >
          <section
            className="auth-section"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="auth-close-btn"
              onClick={() => setAuthMode('')}
              aria-label="Close popup"
            >
              ×
            </button>

            <h2 id="auth-title">
              {authMode === 'profile'
                ? 'My Profile'
                : authMode === 'login'
                  ? 'Welcome Back'
                  : 'Create Your Account'}
            </h2>

            
      {authMode === 'profile' ? (
        <>
          {profileLoading && <p>Loading profile...</p>}

          {profileError && (
            <p className="favorite-error">{profileError}</p>
          )}

          {profileMessage && <p>{profileMessage}</p>}

          {profile && !profileLoading && (
            profileEditing ? (
              <form onSubmit={handleSaveProfile}>
                <label>Username</label>
                <input
                  value={profile.username || ''}
                  disabled
                />

                <label>First Name</label>
                <input
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={(event) =>
                    setProfileForm({
                      ...profileForm,
                      first_name: event.target.value,
                    })
                  }
                />

                <label>Last Name</label>
                <input
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={(event) =>
                    setProfileForm({
                      ...profileForm,
                      last_name: event.target.value,
                    })
                  }
                />

                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(event) =>
                    setProfileForm({
                      ...profileForm,
                      email: event.target.value,
                    })
                  }
                  required
                />

                <button type="submit" disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileEditing(false)
                    setProfileError('')
                    setProfileForm({
                      first_name: profile.first_name || '',
                      last_name: profile.last_name || '',
                      email: profile.email || '',
                    })
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="profile-details">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>First Name:</strong> {profile.first_name || 'Not added'}</p>
                <p><strong>Last Name:</strong> {profile.last_name || 'Not added'}</p>
                <p><strong>Email:</strong> {profile.email || 'Not added'}</p>

                <button
                  type="button"
                  onClick={() => {
                    setProfileError('')
                    setProfileMessage('')
                    setProfileEditing(true)
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )
          )}
          <section className="my-adoption-requests">
          <h3>My Adoption Requests</h3>

          {adoptionRequestsLoading && <p>Loading requests...</p>}

          {adoptionRequestsError && (
            <p className="error-message">{adoptionRequestsError}</p>
          )}

          {!adoptionRequestsLoading &&
            !adoptionRequestsError &&
            myAdoptionRequests.length === 0 && (
              <p>You haven't submitted any adoption requests yet.</p>
            )}

          {myAdoptionRequests.map((request) => (
            <div className="adoption-request-card" key={request.id}>
              <h4>{request.pet_name}</h4>
              <p>
                Submitted:{' '}
                {new Date(request.created_at).toLocaleDateString()}
              </p>
              <p>
                Status:{' '}
                <strong className={`status-${request.status.toLowerCase()}`}>
                  {request.status}
                </strong>
              </p>
            </div>
          ))}
        </section>
        </>
      ) : (
        <>
          {authError && (
            <p className="favorite-error">{authError}</p>
          )}

          {authMessage && <p>{authMessage}</p>}

          <form onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <>
                <input
                  name="first_name"
                  placeholder="First name"
                  value={authForm.first_name}
                  onChange={handleAuthChange}
                  required
                />

                <input
                  name="last_name"
                  placeholder="Last name"
                  value={authForm.last_name}
                  onChange={handleAuthChange}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  required
                />
              </>
            )}

            <input
              name="username"
              placeholder="Username"
              value={authForm.username}
              onChange={handleAuthChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={handleAuthChange}
              minLength={8}
              required
            />

            <button type="submit" disabled={authLoading}>
              {authLoading
                ? 'Please wait...'
                : authMode === 'login'
                  ? 'Login'
                  : 'Create Account'}
            </button>
          </form>

          <p>
            {authMode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login')
                setAuthError('')
                setAuthMessage('')
              }}
            >
              {authMode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </>
      )}

          </section>
        </div>
      )}



      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">FIND YOUR NEW BEST FRIEND</span>
            <h1>
              Adopt, Love,
              <br />
              Cherish <span>♥</span>
            </h1>
            <p>
              Give a loving pet a second chance
              and find a loyal companion for life.
            </p>
            <a className="primary-btn" href="#pets">
              Explore Pets <span>→</span>
            </a>
          </div>

          <div className="hero-image">
            <img src={heroDog} alt="Happy dog ready for adoption" />
          </div>

          <div className="hero-decoration" aria-hidden="true">♥</div>
        </section>


        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">MEET YOUR COMPANION</span>
              <h2>Find your perfect companion</h2>
            </div>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button onClick={() => setAnimalType(animalType === category.type ? '' : category.type )} className="category-item" key={category.name}>
                <span className="category-icon">
                  <img src={category.image} alt="" />
                </span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pets-section" id="pets">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">WAITING FOR A HOME</span>
              <h2>Featured Pets</h2>
            </div>
            <a className="view-all" href="#pets">
              View all <span>→</span>
            </a>
          </div>

          <form
            className="pet-search-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              placeholder="Search by pet name or breed..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" className="primary-btn">
              Search
            </button>

            <button
              type="button"
              className="view-all"
              onClick={() => {
                setSearch('')
                setAnimalType('')
              }}
            >
              Clear filters
            </button>
          </form>

          {petsLoading && <p>Loading pets...</p>}

          {petsError && (
            <p role="alert">{petsError}</p>
          )}

          {!petsLoading && !petsError && pets.length === 0 && (
            <p>No pets found. Try another search.</p>
          )}

          <div className="pet-grid">
            {pets.map((pet) => (
              <article className="pet-card" key={pet.id}>
                <div className="pet-image">
                  <img src={pet.image} alt={pet.name} />
                  <button
                    type="button"
                    className={`favorite-btn ${
                      isFavorite(pet.id) ? 'is-favorite' : ''
                    }`}
                    onClick={() => handleFavorite(pet)}
                    aria-label={
                      isFavorite(pet.id)
                        ? `Remove ${pet.name} from favorites`
                        : `Add ${pet.name} to favorites`
                    }
                    aria-pressed={isFavorite(pet.id)}
                    title={
                      isFavorite(pet.id)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    {isFavorite(pet.id) ? '♥' : '♡'}
                  </button>
                </div>

                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p>{pet.type} · {pet.age}</p>
                  <button
                    className="adopt-btn"
                    onClick={() => {
                      if (!localStorage.getItem('authToken')) {
                        setAuthError('Please log in to adopt a pet.')
                        setAuthMessage('')
                        setAuthMode('login')
                        return
                      }

                      // Next step: open adoption form
                      setSelectedPet(pet)
                    }}
                  >
                    Adopt Me
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>


        <section className="pets-section" id="favorites">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                YOUR FAVORITE COMPANIONS
              </span>
              <h2>My Favorites ♥</h2>
              <p>All the pets you have saved in one place.</p>
            </div>
          </div>

          {favoriteError && (
            <p className="favorite-error" role="alert">
              {favoriteError}
            </p>
          )}

          {favoriteLoading && (
            <p>Loading favorites...</p>
          )}

          {!favoriteLoading && favorites.length === 0 && (
            <div className="near-you-placeholder">
              <p>You haven't added any favorite pets yet. ♡</p>
            </div>
          )}

          <div className="pet-grid">
            {favorites.map((favorite) => {
              const pet =
                typeof favorite.pet === 'object'
                  ? favorite.pet
                  : pets.find((item) => item.id === favorite.pet)

              if (!pet) return null

              return (
                <article className="pet-card" key={favorite.id}>
                  <div className="pet-image">
                    {pet.image ? (
                      <img
                        src={
                          pet.image.startsWith('http')
                            ? pet.image
                            : `http://127.0.0.1:8000${pet.image}`
                        }
                        alt={pet.name}
                      />
                    ) : (
                      <div className="pet-image-placeholder">
                        🐾
                      </div>
                    )}

                    <button
                      type="button"
                      className="favorite-btn is-favorite"
                      onClick={() => handleFavorite(pet)}
                      aria-label={`Remove ${pet.name} from favorites`}
                      title="Remove from favorites"
                    >
                      ♥
                    </button>
                  </div>

                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p>
                      {pet.animal_type || pet.type}
                      {pet.age ? ` · ${pet.age}` : ''}
                    </p>

                    {pet.breed && <p>{pet.breed}</p>}

                    {pet.location && <p>📍 {pet.location}</p>}

                    <button
                      type="button"
                      className="adopt-btn"
                      onClick={() => handleFavorite(pet)}
                    >
                      Remove Favorite
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        
        <section className="pets-section" id="near-you">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">YOUR LOCAL COMPANIONS</span>
              <h2>Pets Near You</h2>
              <p>Find a lovely companion in your area.</p>
            </div>
          </div>

          <form
            className="nearby-search-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Enter your area, e.g. Dhaka"
              value={userLocationName}
              onChange={(e) => setUserLocationName(e.target.value)}
            />

            <button type="submit" className="primary-btn">
              Find Nearby Pets
            </button>

            <button
              type="button"
              className="view-all"
              onClick={() => setUserLocationName('')}
            >
              Clear
            </button>
          </form>

          {userLocationName.trim() && (
            <p className="nearby-results-label">
              Pets in or near "{userLocationName.trim()}"
            </p>
          )}

          
        <div className="pet-grid">
          {nearbyPets.length > 0 ? (
            nearbyPets.map((pet) => (
              <article className="pet-card" key={pet.id}>
                <div className="pet-image">
                  {pet.image ? (
                    <img
                      src={
                        pet.image.startsWith('http')
                          ? pet.image
                          : `http://127.0.0.1:8000${pet.image}`
                      }
                      alt={pet.name}
                    />
                  ) : (
                    <div className="pet-image-placeholder">🐾</div>
                  )}
                </div>

                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p>
                    {pet.animal_type} · {pet.age}
                  </p>
                  {pet.breed && <p>{pet.breed}</p>}
                  {pet.location && <p>📍 {pet.location}</p>}

                  <button className="adopt-btn" disabled>
                    Adopt Me
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="near-you-placeholder">
              <p>No pets found in this area.</p>
              <p>Try another location.</p>
            </div>
          )}
        </div>

        </section>

        <section style={{ backgroundColor: '#f2efe4ff', borderRadius: '10px' }} className="stats-section">
          <div className="stats-heading">
            <span className="section-eyebrow">OUR IMPACT</span>
            <h2>Every Paw Counts 💛</h2>
            <p>Together, we're helping pets find loving homes.</p>
          </div>

          {statsError && <p className="stats-error">{statsError}</p>}

          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-icon">🐾</span>
              <h3>{statistics?.total_animals ?? '—'}</h3>
              <p>Total Animals</p>
            </article>

            <article className="stat-card">
              <span className="stat-icon">💛</span>
              <h3>{statistics?.available_animals ?? '—'}</h3>
              <p>Available Pets</p>
            </article>

            <article className="stat-card">
              <span className="stat-icon">🏡</span>
              <h3>{statistics?.adopted_animals ?? '—'}</h3>
              <p>Adopted Pets</p>
            </article>

            <article className="stat-card">
              <span className="stat-icon">📋</span>
              <h3>{statistics?.total_adoption_requests ?? '—'}</h3>
              <p>Adoption Requests</p>
            </article>
          </div>

          <div className="category-stats">
            <h3>Our Animals at a Glance</h3>
            <p>Total and available pets in each category.</p>

            <div className="category-stats-grid">
              {(
                statistics?.categories ?? []
              ).map((category) => (
                <article
                  className="category-stat-card"
                  key={category.animal_type}
                >
                  <h4>{category.animal_type}</h4>
                  <p>
                    Total: <strong>{category.total}</strong>
                  </p>
                  <p>
                    Available: <strong>{category.available}</strong>
                  </p>
                </article>
              ))}
            </div>

            {statistics && statistics.categories.length === 0 && (
              <p>No animal categories have been added yet.</p>
            )}
          </div>
        </section>


      {selectedPet && (
        <div
          className="auth-modal-overlay"
          onClick={() => setSelectedPet(null)}
        >
          <section
            className="auth-section adoption-section"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adoption-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="auth-close-btn"
              onClick={() => setSelectedPet(null)}
              aria-label="Close adoption form"
            >
              ×
            </button>

            <h2 id="adoption-title">Adopt {selectedPet.name}</h2>
            <p>Tell us a little about yourself and your home.</p>

            {adoptionMessage && (
              <div className="adoption-success" role="status">
                <h3>Request Submitted Successfully!</h3>
                <p>{adoptionMessage}</p>
                <button
                  type="button"
                  className="adopt-btn"
                  onClick={() => {
                    setAdoptionMessage('')
                    setSelectedPet(null)
                  }}
                >
                  Done
                </button>
              </div>
            )}

            <form onSubmit={handleAdoptionSubmit}>
              <label htmlFor="adoption-address">Your Address</label>
              <input
                id="adoption-address"
                name="address"
                placeholder="Enter your address"
                value={adoptionForm.address}
                onChange={handleAdoptionChange}
                required
              />

              <label htmlFor="adoption-phone">Phone Number</label>
              <input
                id="adoption-phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={adoptionForm.phone}
                onChange={handleAdoptionChange}
                required
              />

              <label htmlFor="adoption-reason">Why do you want to adopt?</label>
              <textarea
                id="adoption-reason"
                name="reason"
                placeholder="Tell us why you want to adopt this pet"
                value={adoptionForm.reason}
                onChange={handleAdoptionChange}
                required
              />

              <label htmlFor="adoption-experience">
                Previous Pet Experience
              </label>
              <textarea
                id="adoption-experience"
                name="previous_pet_experience"
                placeholder="Have you cared for pets before?"
                value={adoptionForm.previous_pet_experience}
                onChange={handleAdoptionChange}
              />

              <label htmlFor="adoption-message">Additional Message</label>
              <textarea
                id="adoption-message"
                name="message"
                placeholder="Anything else you want us to know?"
                value={adoptionForm.message}
                onChange={handleAdoptionChange}
              />

              {adoptionError && (
                <p className="favorite-error">{adoptionError}</p>
              )}

              {adoptionMessage && (
                <p>{adoptionMessage}</p>
              )}

              <button
                type="submit"
                className="adopt-btn"
                disabled={adoptionLoading}
              >
                {adoptionLoading
                  ? 'Submitting...'
                  : 'Submit Adoption Request'}
              </button>
            </form>
          </section>
        </div>
      )}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <a className="brand" href="#">
              <span>PetAdopt</span>
            </a>
            <p>Every pet deserves a loving home. 💛</p>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <a href="mailto:your-email@example.com">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5h18v14H3z M3 6l9 7 9-7" />
              </svg>
              <span>email@example.com</span>
            </a>
          </div>

          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a
                href="https://www.facebook.com/your-page"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg style={{ stroke: '#1877F2' }} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4C17.3 1.2 16.2 1 15 1c-3.1 0-5 1.9-5 5.4V9H7v4h3v8z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/your-page"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg style={{ stroke: '#ea60b7ff' }} viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@your-channel"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                title="YouTube"
              >
                <svg style={{ stroke: '#e64848ff' }} viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path d="m10 9 5 3-5 3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PetAdopt. All rights reserved.</p>
          <p>Made with 💛 for animals.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
