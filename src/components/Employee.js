// Initialize from localStorage if present; otherwise use seed data
const stored = typeof window !== 'undefined' ? window.localStorage.getItem('employees') : null;
const seed = [
    {
        id: "100",
        uname: "john",
        age: "30",
        desig: "Developer",
        salary: "35000",
        currency: "USD"
    },
    {
        id: "101",
        uname: "Luke",
        age: "30",
        desig: "tester",
        salary: "35000",
        currency: "USD"
    },
    {
        id: "102",
        uname: "Salim",
        age: "34",
        desig: "Developer",
        salary: "45000",
        currency: "USD"
    },
    {
        id: "103",
        uname: "shibil",
        age: "24",
        desig: "Developer",
        salary: "35000",
        currency: "USD"
    }
];

const Employee = stored ? JSON.parse(stored) : seed;

export default Employee