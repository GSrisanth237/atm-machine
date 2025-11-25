# ATM Machine Project

A web-based ATM simulation system built with Java backend and HTML/CSS/JavaScript frontend.

## Features

- 🔐 Secure login with account number and PIN
- 💰 Check account balance
- 💵 Deposit money
- 💸 Withdraw money
- 🔑 Change PIN
- 📱 Responsive web interface

## Technologies Used

### Backend
- Java (HttpServer)
- RESTful API

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

## Project Structure

```
atm-machine/
├── backend/
│   └── src/
│       └── SimpleServer.java
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Installation & Setup

### Prerequisites
- Java JDK 8 or higher
- Any modern web browser

### Steps to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/GSrisanth237/atm-machine.git
   cd atm-machine
   ```

2. **Compile the Java backend**
   ```bash
   cd backend
   javac -d . src/SimpleServer.java
   ```

3. **Start the server**
   ```bash
   cd ..
   java -cp backend SimpleServer
   ```

4. **Access the application**
   
   Open your browser and go to: `http://localhost:8080`

## Test Accounts

Use these accounts to test the application:

| Account Number | PIN  | Initial Balance |
|---------------|------|-----------------|
| 1001          | 1234 | ₹5000.00        |
| 1002          | 5678 | ₹3000.00        |
| 1003          | 9012 | ₹7500.00        |

## API Endpoints

- `POST /api/authenticate` - User login
- `GET /api/balance` - Get account balance
- `POST /api/deposit` - Deposit money
- `POST /api/withdraw` - Withdraw money
- `POST /api/changepin` - Change PIN
- `GET /api/logout` - Logout user

## Screenshots

*Add screenshots of your application here*

## Future Enhancements

- [ ] Add transaction history
- [ ] Implement database for persistent storage
- [ ] Add mini statement feature
- [ ] Implement fund transfer between accounts
- [ ] Add email notifications
- [ ] Enhanced security with encryption

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**G.A.Srishanth**
- GitHub: [@GSrisanth237](https://github.com/GSrisanth237)
- Email: srishanthsrishanth08@gmail.com

---

⭐ If you found this project helpful, please give it a star!