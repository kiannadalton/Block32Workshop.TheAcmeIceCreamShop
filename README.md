# Block32Workshop.TheAcmeIceCreamShop


Overview
In this workshop you will be building an API which will allow the Acme Ice Cream Shop to manage it's flavors.
Directions

The goal of this workshop is to successfully create the following routes: 

GET /api/flavors - returns array of flavors
GET /api/flavors/:id - returns a single flavor
POST /api/flavors - payload: the flavor to create, returns the created flavor
DELETE /api/flavors/:id - returns nothing
PUT /api/flavors/:id - payload: the updated flavor, returns the updated flavor

Flavor
  id
  name (STRING)
  is_favorite (BOOLEAN)
  created_at (TIMESTAMP)
  updated_at (TIMESTAMP)

 

Create GitHub repository. Use the guided practice as a reference.
Create a database called acme_ice_cream
Create the flavors table. Consider the different columns you'll need to add as well as the most appropriate data types. Don't forget to add code to DROP tables before recreating them.". 
Seed the table with some flavors of your choosing. 
Create express server.
Have express server listen. 
Test your routes using curl and/or Postman, again using guided practice as a reference.
Submit your work in the space provided. 
