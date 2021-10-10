
selectBtn.onclick(selectFile);

//const filePath=await dialog.showOpenDialog();
selectBtn.onclick(()=>{console.log("Oop")});

function selectFile()
{
    console.log("click");

  //  if(selectFileInput)
//selectFileInput.click();
$("inputSF").click();
}

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("inputSF");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
}
function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    var thatDiv=document.getElementById("mainContent");
    thatDiv.style.display="none";
    var dataStruct={
        name:'',
        days:0,
        daysTimes:[],
        salary:0
    }
    const empData=[];
    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[3];
    
    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    const empMap=new Map();
    
   // console.log(excelRows);
   // console.log(workbook);
   
    for(var i=0;i<excelRows.length;i++)
    {
        //console.log(excelRows[i]);
        ///if(excelRows[i].__EMPTY_3)
        //console.log(excelRows[i].__EMPTY_3);
        //console.log(excelRows[i].__EMPTY)
        const temp=excelRows[i].__EMPTY;
        var flag=false;
        var location;
        if(excelRows[i].__EMPTY_3)
        {
            
        for(var p=0;p<empData.length;p++)
        {
            if(empData[p].name==temp)
            {
                flag=true;
                location=p;
                break;
            }
        }
        if(flag)
        {
           empData[p].days++;
            empData[p].daysTimes.push(excelRows[i].__EMPTY_3);
        }
        else
        {
            empData.push({name:temp, days:1,daysLate:0, updatedDays:0,daysTimes:[excelRows[i].__EMPTY_3],daysTimeStruct:[],salary:0});
            
           // console.log(empMap.get(temp));
        }
        }
        
    }
    console.log(empData);
    //Create a HTML Table element.
    for(var i=0;i<empData.length;i++)
    {
        for(var j=0;j<empData[i].daysTimes.length;j++)
        {
            empData[i].daysTimeStruct.push(processDate(empData[i].daysTimes[j]));

        }
        var tenC=0,ninForC=0;
        for(var j=0;j<empData[i].daysTimeStruct.length;j++)
        {
            if(empData[i].daysTimeStruct[j].hour>=10&&empData[i].daysTimeStruct[j].minute>15)
            {
                if(tenC==2)
                {
                    tenC=0;
                    empData[i].days-=1;
                    console.log("Reduced", empData[i].name);
                }
                else
                {
                    tenC++;
                }
                
            }
            else if(empData[i].daysTimeStruct[j].hour>=9&&empData[i].daysTimeStruct[j].minute>45)
            {
                if(ninForC==3)
                {
                    ninForC=0;
                    empData[i].days-=1;
                    console.log("Reduced", empData[i].name);
                }
                else
                {
                    ninForC++;
                }
            }
        }
    }
    console.log(empData);
    var div=document.getElementById("data");
   // div.innerHTML="";

    var elRow=document.getElementById("ElementPrimaryRow");
    elRow.style.display="flex ";

    for(var i=0;i<empData.length;i++)
    {
        div.append(createEl(empData[i]))
    }
};
function processDate(date)
{
    console.log(date);
    var flag=false;
    var hour=0,minute=0;
    for(var i=0;i<date.length;i++)
    {
      
        if(date[i]==':')
        {
            flag=true;
            
        }
        else{ if(flag==false)
        {
            hour=hour*10+parseInt(date[i]);
        }
        else
        {
            minute=minute*10+parseInt(date[i]);
        }}
        console.log(hour, minute, i);
    }
    return {hour:hour,minute:minute};
}

function createEl(data)
{
    if(data.name=="Name"||!data.name)
    {
        return("");
    }
  var div=  document.createElement("div");
  var name=document.createElement("span");
  name.innerHTML=data.name;
  name.className="ElementName";
  div.className="ElementDiv form-group";
  div.innerHTML="";
  div.append(name);
  var Days=document.createElement("span");
  Days.className="ElementDays";
  Days.innerHTML=data.days;
  div.append(Days);
  var sal=document.createElement("input");
  sal.className="ElementInput form-control";
  sal.placeholder="Salary"; sal.onkeyup=event => {
    if(event.key !== "Enter") return; // Use `.key` instead.
    calc.click(); // Things you want to do.
    event.preventDefault();};
  div.append(sal);
  var calc=document.createElement("button");
  calc.innerHTML="Calculate";
  calc.className="ElementButton btn-outline-success btn";
  calc.type="submit";
  div.append(calc);
  var salaryVal;
  calc.onclick=()=>{
        console.log(Date.now(), data.days*sal.value/26);
        salaryVal=Math.ceil(data.days*sal.value/26);
        sal.style.display="none";
        calc.style.display="none";
        var tempSal=document.createElement("span");
        tempSal.innerHTML="Salary:";
        tempSal.className="ElementDays";
        div.append(tempSal);
        var salary=document.createElement("span");
        var salValStr="Rs. "+salaryVal;
        console.log(salValStr);
        salary.className="ElementDays";
        salary.innerHTML=salValStr;
        div.append(salary);
    }
  
  return div;
}