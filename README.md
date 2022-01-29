# Express-typescript

#1 git pull https://github.com/kamalakkannan1984/express-typescript.git

#2 >> cd hakunamatata

#3 >> yarn => install node_modules

#4 Connect redis server for session

> > docker run --name=cache --publish=6379:6379 --hostname=redis --restart=on-failure --detach redis:latest
> > docker start cache

#5 Connect database mongodb://localhost:27017 OR You can change in config file

#6 >> yarn . => Run application
server started at http://localhost:3000
Connected to session store.
Connected to the App.
Successfully populated location file.
Successfully created default user.
username: destributor1
password: 1234

#7 Login api
POST
http://localhost:3000/api/login
Request
username: destributor1
password: 1234
Response
{
"username": "distributor1",
"include": [
{
"countryCode": [
"IN",
"US"
],
"cityCode": [],
"ProvinceCode": []
}
],
"exclude": [
{
"countryCode": [
"IN"
],
"ProvinceCode": [
"TN",
"KA"
],
"cityCode": [
"CENAI"
]
}
]
}

#8 Add user
POST
http://localhost:3000/api/distributors
Request
{
"include": [
{"countryCode": ["IN"], "cityCode": [], "ProvinceCode": []}
],
"exclude": [
{"countryCode": [], "cityCode": [] , "ProvinceCode": []}
],
"distributorName": "Distributor2",
"username": "distributor2",
"password": "1234"
  
}
Response
{
"include": [
{
"countryCode": [
"IN"
],
"cityCode": [],
"ProvinceCode": []
}
],
"exclude": [
{
"countryCode": [],
"cityCode": [],
"ProvinceCode": []
}
],
"\_id": "5df64af3fbc83d1608f9175e",
"distributorName": "Distributor2",
"username": "distributor2",
"createdBy": "distributor1",
"createdDate": "2019-12-15T15:02:11.408Z",
"\_\_v": 0
}

#9 Update user
PUT
http://localhost:3000/api/distributors/distributor2
Request
{
"include": [
{"countryCode": ["IN"], "cityCode": [], "ProvinceCode": ["AR"]}
],
"exclude": [
{"countryCode": ["JP"], "cityCode": [] , "ProvinceCode": []}
],
"distributorName": "Distributor2",
"username": "distributor2",
"password": "1234"
  
}
Response
{
"msg": "Exclude Country Not Allowed!"
}
#10 Delete user
DELETE
http://localhost:3000/api/distributors/distributor2
Response
{
"msg": "Successfully deleted"
}

#11 Check distributor
GET
http://localhost:3000/api/distributors/checkDistribtionCityName/SINGU
Response
{
"msg": "NO"
}

#12 logout
GET
http://localhost:3000/api/logout

#13 check logged In
POST
http://localhost:3000/api/logged-in
Request
checkLoggedIn : true
Response
{
"username": "distributor2"
}

Docker commands:
Build image

> > docker build -t hakuna-app:latest .
> > List of all images
> > docker images
> > Docker container list all
> > docker ps -a
> > Docker container list
> > docker ps
> > Docker run command
> > docker run -it hakuna-app:latest
> > server stated .....
> > Docker run expose the port
> > docker run -it -p 3001:3000 hakuna-app:latest
> > server started 0.0.0.0:3001
