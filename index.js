const express = require('express')
const app = express()
const port = 3001
var bodyParser = require('body-parser');
const db = require('./db')

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

//add to local
async function addStudentToLocal(first,last){
    student = {
        name:first,
        last:last,
        id:students.length,
        grades:[],
    }
    return new Promise(students.push(student))
    
    console.log("add student ",students)

    //add to database:
}

//add to local
function addGradeToLocal(studentID,className,gradeLetter){
    newGrade = {
        className:className,
        grade:gradeLetter
    }
    students[studentID-1].grades.push(newGrade);
    console.log("add Grade:",newGrade)
}

//add to db
function addGrade(studentID,className,gradeLetter){
    db.query(`INSERT INTO grades (user_id, class, grade) VALUES('${studentID}','${className}','${gradeLetter}')`
    , (err, results) => {
        if(err){
            console.log(err)
        } else {
            console.log("all good "+err);
            
        }
    })
}

//add to db
function addStudent(first,last){
    //add to database:
    //console.log(`INSERT INTO students (firstName, lastName) VALUES("${first}","${last}")`)
    db.query(`INSERT INTO students (firstName, lastName) VALUES('${first}','${last}')`
    , (err, results) => {
        if(err){
            console.log(err)
        } else {
            console.log("all good "+err);
            
        }
    })





}
async function populateLocal() {
    //query db, populate datea




    ;(async () => {
        const results = await db.query(`SELECT * from students`)

        //console.log("got all from students")
        
        //replace local data with what was pulled form db
        //students = results.rows;
      })().catch(err =>
        setImmediate(() => {
          console.log(err)
        })
      )

      console.log("in db function")



    // await db.query(`SELECT * from students`)
    // .then(results => {
        
        
            
    //         //console.log("got all from students")
    //         results.rows.forEach((row) => {
    //             //console.log(row.firstname, row.lastname)
    //             addStudentToLocal(row.firstname,row.lastname)
    //             //console.log (`SELECT * from grades where user_id = ${row.user_id}`) 
                
                
    //             ;(async () => {
    //                 const grades = await db.query(`SELECT * from grades where user_id = ${row.user_id}`)
    //                 grades.rows.forEach((grade) => {
    //                     console.log(grade.class, grade.grade)
    //                     addGradeToLocal(grade.user_id,grade.class,grade.grade)
    //                 }) 
    //               })().catch(err =>
    //                 setImmediate(() => {
    //                   console.log(err)
    //                 })
    //               )


    //             // await db.query(`SELECT * from grades where user_id = ${row.user_id}`)
    //             // .then(grades => {                   
    //             //         grades.rows.forEach((grade) => {
    //             //             console.log(grade.class, grade.grade)
    //             //             addGradeToLocal(grade.user_id,grade.class,grade.grade)
    //             //         })                    
    //             // }).catch(err =>{
    //             //     setImmediate(() => {
    //             //         throw err
    //             //       })
                    
    //             // })
                
    //         })
    //         //replace local data with what was pulled form db
    //         //students = results.rows;
        

    // })
    // .catch (err =>{
    //     setImmediate(() => {
    //         throw err
    //       })
        
//})
    
    
}



app.get('/students', (req, res) => {
    

    students = []
    
    db.query(`SELECT * from students`, (err, results) => {
        if (err) {
            throw error
        } else {

            results.rows.forEach((row) => {
                //console.log(row.firstname, row.lastname)
    
                student = {
                    name:row.firstname,
                    last:row.lastname,
                    id:students.length,
                    grades:[],
                }
                students.push(student)
                //console.log(students)
    
                //await addStudentToLocal(row.firstname,row.lastname)
                //console.log (`SELECT * from grades where user_id = ${row.user_id}`) 
                
                db.query(`SELECT * from grades where user_id = ${row.user_id}`, (err, grades) => {
                    if (err) {
                        throw error
                    } else {
                        grades.rows.forEach( (item) => {
                            //addGradeToLocal(item.user_id,item.class,item.grade)

                            newGrade = {
                                className:item.class,
                                grade:item.grade
                            }
                            students[item.user_id-1].grades.push(newGrade);
                            console.log("add Grade:",newGrade)

                            console.log(`SELECT * from grades where user_id = ${row.user_id}`)
                        })
                        
                    }
                    
                    })

                
    
    
                // await db.query(`SELECT * from grades where user_id = ${row.user_id}`)
                // .then(grades => {                   
                //         grades.rows.forEach((grade) => {
                //             console.log(grade.class, grade.grade)
                //             addGradeToLocal(grade.user_id,grade.class,grade.grade)
                //         })                    
                // }).catch(err =>{
                //     setImmediate(() => {
                //         throw err
                //       })
                    
                // })
                
            })

            
        }

        console.log(students);

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