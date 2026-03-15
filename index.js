const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const app = express();
app.use(express.json()); 
//Database Connection
const databaseDetails = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    } 
};
//To calculate distance between two locations
function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    const earthRadiusInKilometers = 6371; 
    const latDifference = (latitude2 - latitude1) * (Math.PI / 180);
    const lonDifference = (longitude2 - longitude1) * (Math.PI / 180);
    const lat1Radian = latitude1 * (Math.PI / 180);
    const lat2Radian = latitude2 * (Math.PI / 180);
    const a = Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
              Math.sin(lonDifference / 2) * Math.sin(lonDifference / 2) * Math.cos(lat1Radian) * Math.cos(lat2Radian); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const finalDistance = earthRadiusInKilometers * c;
    return finalDistance;
}
app.post('/addSchool', async (request, response) => {
    const name = request.body.name;
    const address = request.body.address;
    const latitude = request.body.latitude;
    const longitude = request.body.longitude;
    if (!name || !address || !latitude || !longitude) {
        return response.status(400).json({ error: "Please provide all school details (name, address, latitude, longitude)." });
    }
    try {
        const connection = await mysql.createConnection(databaseDetails);
        const sqlQuery = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sqlQuery, [name, address, latitude, longitude]);
        await connection.end(); 
        response.status(201).json({ message: "School added successfully", newSchoolId: result.insertId });
    } catch (error) {
        console.log("Database error:", error);
        response.status(500).json({ error: "Failed to save the school to the database." });
    }
});
app.get('/listSchools', async (request, response) => {
    const userLatitude = parseFloat(request.query.latitude);
    const userLongitude = parseFloat(request.query.longitude);
    if (!userLatitude || !userLongitude) {
        return response.status(400).json({ error: "Please provide a valid latitude and longitude in the URL." });
    }
    try {
        const connection = await mysql.createConnection(databaseDetails);
        const [allSchools] = await connection.execute('SELECT * FROM schools');
        await connection.end();
        const schoolsWithDistance = [];
        for (let i = 0; i < allSchools.length; i++) {
            let currentSchool = allSchools[i];
            let distance = calculateDistance(userLatitude, userLongitude, currentSchool.latitude, currentSchool.longitude);
            schoolsWithDistance.push({
                id: currentSchool.id,
                name: currentSchool.name,
                address: currentSchool.address,
                latitude: currentSchool.latitude,
                longitude: currentSchool.longitude,
                distanceInKilometers: distance
            });
        }
        schoolsWithDistance.sort((schoolA, schoolB) => {
            return schoolA.distanceInKilometers - schoolB.distanceInKilometers;
        });
        response.status(200).json(schoolsWithDistance);
    } catch (error) {
        console.log("Database error:", error);
        response.status(500).json({ error: "Failed to fetch schools from the database." });
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});