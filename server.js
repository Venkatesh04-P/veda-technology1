const express = require("express");
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================
   SESSION
========================================= */

app.use(
    session({
        secret: "veda-technology-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

/* =========================================
   MESSAGES FILE
========================================= */

const messagesFile =
    path.join(__dirname, "messages.json");


/* Create messages.json if it doesn't exist */

if (!fs.existsSync(messagesFile)) {

    fs.writeFileSync(
        messagesFile,
        "[]",
        "utf8"
    );

}


/* Read messages */

function readMessages() {

    try {

        const data =
            fs.readFileSync(
                messagesFile,
                "utf8"
            );

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Error reading messages:",
            error
        );

        return [];

    }

}


/* Save messages */

function saveMessages(messages) {

    fs.writeFileSync(
        messagesFile,
        JSON.stringify(
            messages,
            null,
            2
        ),
        "utf8"
    );

}


/* =========================================
   HOME / SERVER TEST
========================================= */

app.get("/", function (req, res) {

    res.json({

        success: true,

        message:
            "VEDA TECHNOLOGY backend is running."

    });

});


/* =========================================
   HEALTH CHECK
========================================= */

app.get(
    "/api/health",
    function (req, res) {

        res.json({

            success: true,

            message:
                "API is working."

        });

    }
);


/* =========================================
   CONTACT FORM
========================================= */

app.post(
    "/api/contact",
    function (req, res) {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        /* Validation */

        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all the fields."

            });

        }


        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

            });

        }


        /* Read existing messages */

        const messages =
            readMessages();


        /* Create new message */

        const newMessage = {

            id: Date.now(),

            name: name.trim(),

            email: email.trim(),

            subject: subject.trim(),

            message: message.trim(),

            date:
                new Date().toISOString()

        };


        /* Add message */

        messages.push(newMessage);


        /* Save message */

        saveMessages(messages);


        /* Send response */

        res.status(201).json({

            success: true,

            message:
                "Thank you! Your message has been submitted successfully."

        });

    }
);


/* =========================================
   ADMIN LOGIN
========================================= */

app.post(
    "/api/login",
    function (req, res) {

        const {
            username,
            password
        } = req.body;


        /*
          Temporary login credentials
          
          Username: admin
          Password: admin123
        */

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            req.session.isAdmin = true;

            return res.json({

                success: true,

                message:
                    "Login successful."

            });

        }


        res.status(401).json({

            success: false,

            message:
                "Invalid username or password."

        });

    }
);


/* =========================================
   CHECK LOGIN
========================================= */

app.get(
    "/api/check-login",
    function (req, res) {

        if (
            req.session &&
            req.session.isAdmin
        ) {

            return res.json({

                loggedIn: true

            });

        }


        res.status(401).json({

            loggedIn: false

        });

    }
);


/* =========================================
   GET MESSAGES
========================================= */

app.get(
    "/api/messages",
    function (req, res) {

        if (
            !req.session ||
            !req.session.isAdmin
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        const messages =
            readMessages();


        res.json({

            success: true,

            messages: messages

        });

    }
);


/* =========================================
   DELETE MESSAGE
========================================= */

app.delete(
    "/api/messages/:id",
    function (req, res) {

        if (
            !req.session ||
            !req.session.isAdmin
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        const id =
            Number(req.params.id);


        const messages =
            readMessages();


        const updatedMessages =
            messages.filter(
                function (message) {

                    return message.id !== id;

                }
            );


        saveMessages(updatedMessages);


        res.json({

            success: true,

            message:
                "Message deleted successfully."

        });

    }
);


/* =========================================
   LOGOUT
========================================= */

app.post(
    "/api/logout",
    function (req, res) {

        req.session.destroy(
            function (error) {

                if (error) {

                    return res.status(500).json({

                        success: false,

                        message:
                            "Logout failed."

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Logged out successfully."

                });

            }
        );

    }
);


/* =========================================
   404
========================================= */

app.use(
    function (req, res) {

        res.status(404).json({

            success: false,

            message:
                "Route not found."

        });

    }
);


/* =========================================
   START SERVER
========================================= */

app.listen(
    PORT,
    function () {

        console.log(
            "================================"
        );

        console.log(
            "VEDA TECHNOLOGY BACKEND"
        );

        console.log(
            "================================"
        );

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            "Contact API: POST /api/contact"
        );

        console.log(
            "Login API: POST /api/login"
        );

        console.log(
            "Messages API: GET /api/messages"
        );

        console.log(
            "================================"
        );

    }
);