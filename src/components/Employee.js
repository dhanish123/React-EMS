// Initialize from localStorage if present; otherwise start empty so the app opens with an empty state
const stored = typeof window !== 'undefined' ? window.localStorage.getItem('employees') : null;
const Employee = stored ? JSON.parse(stored) : [];

export default Employee