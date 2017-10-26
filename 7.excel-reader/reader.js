var excel = require("xlsx");

var workbook = excel.readFile("example.xlsx"),
    sheets = workbook.Sheets,
    sheets_name = workbook.SheetNames,
    aim = sheets_name[0];

var result = excel.utils.sheet_to_json(sheets[aim]);
console.log(result);