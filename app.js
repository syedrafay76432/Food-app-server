// server/app.js (or server/server.js)
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();

// ...

// Serve the React app as a static file
app.use(express.static(path.join(__dirname, '../client/build')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// Parse request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ...

// Catch-all route to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// ...
app.post('/submit', (req, res) => {
    const { name, email, phone, address,totalAmount,items} = req.body;
    console.log(req.body)
    const itemsList = items.map((item) => {
        return `${item.amount} ${item.name}`
    })
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.myemail,
            pass: process.env.pass
        }
    });
    
    // Define the email options
    const mailOptions1 = {
        from: process.env.myemail,
        to: process.env.myemail,
        subject: 'Order Recived From ReactMeal',
        text: 
        `Customer name: ${name},
         Customer Email: ${email},
         Customer Email: ${phone},
         Customer Email: ${address},
         Items: ${itemsList}
         Total Amount: ${totalAmount}
        `
    };
    // Define the email options
    const mailOptions2 = {
        from: 'syedrafay76432@gmail.com',
        to: email,
        subject: `Thank You for Your Purchase ${name}!`,
        text: `Dear ${name},

     Thank you for choosing to shop with us! We appreciate your recent purchase from our website and wanted to express our sincere gratitude.
        
     At ReactMeal, we strive to provide top-notch products and excellent customer service. Your support means the world to us, and we're grateful for the trust you've placed in us.
        
     If you have any questions, concerns, or feedback, our dedicated customer support team is here to assist you. Feel free to reach out to us at any time.
        
     Once again, thank you for your order. We value your business and look forward to serving you again in the future.
        
     Best regards,
        
     Syed Rafay
     ReactMeal
     syedrafay76432@gmail.com`
    };

    // Send the email
    transporter.sendMail(mailOptions1, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
