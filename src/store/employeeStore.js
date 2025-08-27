import { create } from 'zustand'

/**
 * ZUSTAND STORE IMPLEMENTATION
 * 
 * WHY ZUSTAND OVER REDUX:
 * 1. SIMPLER SETUP: No providers, no complex boilerplate code
 * 2. SMALLER BUNDLE: ~1KB vs Redux Toolkit's ~15KB
 * 3. FAMILIAR PATTERNS: Uses React hooks and standard JavaScript
 * 4. NO WRAPPERS: Components can directly import and use the store
 * 5. PERFECT FOR SMALL-MEDIUM APPS: Like this Employee Management System
 * 
 * HOW IT DIFFERS FROM REDUX:
 * 1. NO ACTIONS: Direct state mutations (simpler but less predictable)
 * 2. NO REDUCERS: State updates happen directly in the store
 * 3. NO PROVIDERS: No need to wrap app with Provider component
 * 4. NO SELECTORS: Direct access to store state
 * 5. NO DISPATCH: Direct function calls to update state
 * 6. NO IMMUTABILITY ENFORCEMENT: You must manually ensure immutability
 */

// Create the Zustand store
export const useEmployeeStore = create((set, get) => ({
  // STATE - Similar to Redux state
  employees: [],
  loading: false,
  error: null,
  currentEmployee: null,
  searchTerm: '',
  sortBy: 'uname',
  sortOrder: 'asc',

  // ACTIONS - Similar to Redux actions but simpler
  // In Redux, you'd have action creators and reducers
  // In Zustand, you directly update state

  // Add new employee
  addEmployee: (employee) => {
    set((state) => ({
      employees: [...state.employees, { ...employee, id: Date.now().toString() }]
    }))
  },

  // Update existing employee
  updateEmployee: (id, updatedEmployee) => {
    set((state) => ({
      employees: state.employees.map(emp => 
        emp.id === id ? { ...emp, ...updatedEmployee } : emp
      )
    }))
  },

  // Delete employee
  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter(emp => emp.id !== id)
    }))
  },

  // Set current employee for editing
  setCurrentEmployee: (employee) => {
    set({ currentEmployee: employee })
  },

  // Clear current employee
  clearCurrentEmployee: () => {
    set({ currentEmployee: null })
  },

  // Set search term
  setSearchTerm: (term) => {
    set({ searchTerm: term })
  },

  // Set sorting
  setSorting: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder })
  },

  // Get filtered and sorted employees
  getFilteredEmployees: () => {
    const state = get()
    let filtered = state.employees

    // Apply search filter
    if (state.searchTerm) {
      filtered = filtered.filter(emp => 
        emp.uname?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        emp.desig?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        emp.age?.toString().includes(state.searchTerm) ||
        emp.salary?.toString().includes(state.searchTerm)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      // Handle different data types for sorting
      if (state.sortBy === 'age' || state.sortBy === 'salary') {
        aValue = a[state.sortBy] || 0;
        bValue = b[state.sortBy] || 0;
      } else {
        aValue = a[state.sortBy]?.toLowerCase() || '';
        bValue = b[state.sortBy]?.toLowerCase() || '';
      }
      
      if (state.sortOrder === 'asc') {
        if (typeof aValue === 'number') {
          return aValue - bValue;
        }
        return aValue.localeCompare(bValue);
      } else {
        if (typeof aValue === 'number') {
          return bValue - aValue;
        }
        return bValue.localeCompare(aValue);
      }
    })

    return filtered
  },

  // Get employee by ID
  getEmployeeById: (id) => {
    const state = get()
    return state.employees.find(emp => emp.id === id)
  },

  // Get total count
  getTotalCount: () => {
    const state = get()
    return state.employees.length
  },

  // Reset store (useful for testing or logout)
  resetStore: () => {
    set({
      employees: [],
      loading: false,
      error: null,
      currentEmployee: null,
      searchTerm: '',
      sortBy: 'uname', // Changed from 'name' to 'uname'
      sortOrder: 'asc'
    })
  }
}))

/**
 * USAGE COMPARISON:
 * 
 * ZUSTAND (Current Implementation):
 * const { employees, addEmployee } = useEmployeeStore()
 * addEmployee(newEmployee) // Direct function call
 * 
 * REDUX (For Comparison):
 * const employees = useSelector(state => state.employees)
 * const dispatch = useDispatch()
 * dispatch(addEmployee(newEmployee)) // Action dispatch
 * 
 * BENEFITS OF ZUSTAND HERE:
 * 1. Less code to write
 * 2. Easier to understand
 * 3. Faster development
 * 4. Better performance for small-medium apps
 * 5. No need to learn Redux concepts
 */
