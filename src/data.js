const DATA = [
    {
        email: "admin",
        password: "admin",
        fullname: "Andy Dwyer",
        type: "Savings Dollar",
        number: "47290539480",
        balance: 1000,
        isAdmin: true, 
        transactions: []
    },
    {
        email: "ron.swason@gmail.com",
        password: "abc123",
        fullname: "Ron Swanson",
        type: "Savings Dollar",
        number: "47290539481",
        balance: 1029300.43,
        isAdmin: true, 
        transactions: []
    },
    {
        email: "leslie.knope@gmail.com",
        password: "abc123",
        fullname: "Leslie Knope",
        type: "Savings Dollar",
        number: "47290539482",
        balance: 392830.22,
        isAdmin: false, 
        budget: [
            {
                title: "Tuition fee",
                amount: 12000
            },
            {
                title: "Waffles",
                amount: 4000
            }
        ], 
        transactions: [
            {
                title: "Fund transfer", 
                amount: 2000,
                type: "debit", 
                date: "October 1, 2021"
            }, 
            {
                title: "Withdraw", 
                amount: 10000, 
                type: "debit",
                date: "October 1, 2021"
            }
        ]
    },
    {
        email: "tom.haverford@gmail.com",
        password: "abc123",
        fullname: "Tom Haverford",
        type: "Savings Dollar",
        number: "47290539483",
        balance: 102938.34,
        isAdmin: false, 
        transactions: []
    }
];

export default DATA;
