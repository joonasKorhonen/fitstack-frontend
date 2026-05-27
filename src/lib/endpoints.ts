export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  users: {
    profile: '/api/users/profile',
    avatar: '/api/users/avatar',
  },
  meals: {
    list: '/api/meals',
    detail: (id: string | number) => `/api/meals/${id}`,
  },
  workouts: {
    list: '/api/workouts',
    detail: (id: string | number) => `/api/workouts/${id}`,
    sets: (id: string | number) => `/api/workouts/${id}/sets`,
    set: (workoutId: string | number, setId: string | number) =>
      `/api/workouts/${workoutId}/sets/${setId}`,
  },
  movements: {
    list: '/api/movements',
  },
} as const;
