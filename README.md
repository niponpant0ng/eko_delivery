EKO Delivery
I provide restful api to access these api following these
***
1. Create route with cost from route to another route
POST /routes
  **route1, route2, ...**
ex.
POST /routes
AB1, AC4, AD10, BE3, CD4, CF2

    \* content-type is **text/plain**
***
2. Get cost from route to another route
GET /routes/cost/**FROM-TO1-TO2-...**
ex.
GET /routes/cost/A-B-C-D
***
3. Get posible path from route to another route
GET /routes/**FROM-TO**
ex.
GET /routes/A-B
***
4. Get posible path from route to another route with limit of step
GET /routes/**FROM-TO**/limit/**limit**
ex.
GET /routes/A-B/limit/3
***