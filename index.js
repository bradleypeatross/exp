const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    var responseString = ""
    var linksString = `<br>
    <a href='/students'>students</a><br>
    <a href='/register'>add students</a><br>
    <a href='/grades'>add grades</a><br>
    <a href='/'>home</a><br>
    `;
    responseString += linksString;
    res.send(responseString)
})

var students = []

function addStudent(first,last){
    student = {
        name:first,
        last:last,
        id:students.length,
        grades:[],
    }
    students.push(student)
}

function addGrade(studentID,className,gradeLetter){
    newGrade = {
        className:className,
        grade:gradeLetter
    }
    students[studentID].grades.push(newGrade);
}

app.get('/students', (req, res) => {

    var queryName = req.query.name
    console.log(req.query);

    var responseString = "<h1>List of students</h1>\n\r";

    responseString += "<ul>"
    students.forEach(function (arrayItem) {
        if (queryName) {
            if (queryName == arrayItem.name){
                responseString += "<li>"+arrayItem.name + "</li>";
                //show grades
                responseString += "<ul>"
                arrayItem.grades.forEach(function (subArrayItem) {
                    responseString +="<li>"+ subArrayItem.className+": "+subArrayItem.grade+"</li>";
                })
                responseString += "</ul>"
            } else {
    
                responseString += "name not found"
            }
        } else {
            responseString += "<li>"+arrayItem.name + "</li>";
                //show grades
                responseString += "<ul>"
                arrayItem.grades.forEach(function (subArrayItem) {
                    responseString +="<li>"+ subArrayItem.className+": "+subArrayItem.grade+"</li>";
                })
                responseString += "</ul>"
        }
    })

    responseString += "</ul>"

    var linksString = `<br>
    <a href='/students'>students</a><br>
    <a href='/register'>add students</a><br>
    <a href='/grades'>add grades</a><br>
    <a href='/'>home</a><br>
    `;
    responseString += linksString;
    res.send(responseString);

})

app.get('/students/:studentId', (req, res) => {

    const studentId = req.params.studentId;

    var responseString = "student id is:"+studentId;

    responseString = students[studentId];

    var linksString = `<br>
    <a href='/students'>students</a><br>
    <a href='/register'>add students</a><br>
    <a href='/grades'>add grades</a><br>
    <a href='/'>home</a><br>
    `;
    responseString += linksString;
    res.send(responseString);

})

app.get('/register', (req, res) => {
    var responseString = `
<html>
   <body>
      
      <form action = "http://localhost:3000/process_post" method = "POST">
         First Name: <input type = "text" name = "first_name"> <br>
         Last Name: <input type = "text" name = "last_name">
         <input type = "submit" value = "Submit">
      </form>
   </body>
</html>`
var linksString = `<br>
<a href='/students'>students</a><br>
<a href='/register'>add students</a><br>
<a href='/grades'>add grades</a><br>
<a href='/'>home</a><br>
`;
responseString += linksString;
res.send(responseString)
})

app.post('/process_post',urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
    };
    addStudent(response.first_name,response.last_name)
    console.log(response);

    var responseString = "Student added: "+JSON.stringify(response);

    var linksString = `<br>
    <a href='/students'>students</a><br>
    <a href='/register'>add students</a><br>
    <a href='/grades'>add grades</a><br>
    <a href='/'>home</a><br>
    `;
    responseString += linksString;
    res.send(responseString);
 })


 app.get('/grades', (req, res) => {
    var responseString = `
<html>
   <body>
      
      <form action = "http://localhost:3000/process_grades" method = "POST">
         StudentID: <input type = "text" name = "studentID"> <br>
         Class Name: <input type = "text" name = "className">
         Grade Letter: <input type = "text" name = "gradeLetter">
         <input type = "submit" value = "Submit">
      </form>
   </body>
</html>`
var linksString = `<br>
<a href='/students'>students</a><br>
<a href='/register'>add students</a><br>
<a href='/grades'>add grades</a><br>
<a href='/'>home</a><br>
`;
responseString += linksString;
res.send(responseString)
})

app.post('/process_grades',urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        studentID:req.body.studentID,
        className:req.body.className,
        gradeLetter:req.body.gradeLetter
    };
    //add grades
    addGrade(response.studentID,response.className,response.gradeLetter)
    console.log(response);
    var responseString = "Grade: "+JSON.stringify(response);

    var linksString = `<br>
    <a href='/students'>students</a><br>
    <a href='/register'>add students</a><br>
    <a href='/grades'>add grades</a><br>
    <a href='/'>home</a><br>
    `;
    responseString += linksString;
    res.send(responseString);
 })

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))