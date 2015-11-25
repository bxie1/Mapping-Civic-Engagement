# Swat-Civic-Engagement-Map
Local map of faculty who have civic engagement projects / courses.

## Technology Stack

- Node.JS
- Express
- MongoDB
- [Jade](http://jade-lang.com/)
- [Basscss](http://www.basscss.com/)

## Development Instructions

1. Clone this repository
2. Open terminal and change directories into the root directory of the project
3. If this is the first time launching the application, issue the following command to install dependancies ``` npm install ```
4. Make sure mongodb is running with the following command: ``` mongod ```
5. Insert the sample data with the following command: ``` mongoimport -d sse -c locations  data/sample-data/sample.json --jsonArray --drop ```
6. Once all dependancies have been installed launch the application with the following command ``` node index.js ```
7. Open a browser and visit the following url: http://http://localhost:3000/

## Contributing

Please do all development in a branch other than **master**

When submitting a Pull Request, please answer the following questions:

**What does this Pull Request do?**

**Is this related to any currently open issues? If so, please note the issue #.**
