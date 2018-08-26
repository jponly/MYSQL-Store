var mysql =     require("mysql");
var inquirer =  require("inquirer");
var Table =     require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "jpsql008$",
  database: "bamazonDB"
});



connection.connect(function(err) {
  if (err) throw err;

});

//Function for the Supervisor Menu Options
function supervisoryMenu(){
	inquirer.prompt([
			{
			  type: 'list',
			  message: 'Please choose a Bamazon Supervisor Activity:',
			  choices: ["View Departmental Product Sales", "Create New Department", "Exit"],
			  name: 'options'
			}
		]).then(function(results){
			switch(results.options){
				case "View Departmental Product Sales":
				  deptTable();                    
					setTimeout(supervisoryMenu, 1000);  
					break;
				case "Create New Department":
					addDept();                     
					break;
				case 'Exit':
					console.log("Keep on growing our sales!");
					process.exit(0);   
					break;
			}
	});
};

supervisoryMenu(); 

//Function to print the dept table
function deptTable() {
    connection.query('SELECT * FROM departments', function(err, results) {        
            if (err) throw err;
            var table = new Table({                                              
                head: [('ID'), ('Department Name'),   
                  ('Overhead Costs'), ('Total Sales'), ('Total Profit')],
                colWidths: [5, 23, 23, 23, 23]                                    
            });
            for (var i = 0; i < results.length; i++){     
            table.push(                                   
                [(JSON.parse(JSON.stringify(results))[i]["department_id"]), (JSON.parse(JSON.stringify(results))[i]["department_name"]),
                ("$ "+JSON.parse(JSON.stringify(results))[i]["overhead_costs"].toFixed(2)), ("$ "+JSON.parse(JSON.stringify(results))[i]["total_sales"].toFixed(2)),
                ("$ "+parseFloat(results[i].total_sales - results[i].overhead_costs).toFixed(2))]);
  			}
        console.table("\n" + table.toString());            
    });
};

//Function enabling the user to dynamically add new Departments
function addDept(){
	inquirer.prompt([
			{
				type: 'input',
				message: 'Please enter a department name:',
				name: 'dept_name'
			},
			{
				type: 'input',
				message: 'Please enter overhead costs:',
				name: 'costs'
			}
		]).then(function(answers){
			var dept_name = answers.dept_name;   
			var costs = answers.costs;         
      var totalSales = 0;
      
			connection.query('INSERT INTO departments (department_name, overhead_costs, total_sales) VALUES (?, ?, ?)', [dept_name, costs, totalSales], function(err, results){
				if(err) throw err;
			});
			if (dept_name && costs !== undefined) {
        setTimeout(deptTable, 500);
				setTimeout(supervisoryMenu, 1500);
			}

		});

};

