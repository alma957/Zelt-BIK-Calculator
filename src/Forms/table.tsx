import {  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow , Box, Typography} from "@mui/material"
import {currencyFormat,calculateNI,calculateAnnualCompanyNic,calculateAnnualDirectorEmployeeNic,calculateDirectorNic,calculateCompanyDirNic} from "./nationalInsurance"
import { employeeRates,employerData,RatesType,directorRates,directorRatesByCategory,AnnualDirectorDataByCategory, AnnualDirectorData,PAYERates,payeRatesList,PayeRatesJuris} from "./variables"

export const OutputTable = ({bikValue,bikType,jurisdiction,director,pay,category,calculationType,proRata,firstPeriodPaid}:any): JSX.Element => {

    pay = isNaN(pay) ? 0 : pay
    bikValue = isNaN(bikValue) ? 0: bikValue

    const rows:Array<any> = []
    const rates = directorRatesByCategory[category as keyof AnnualDirectorDataByCategory] as AnnualDirectorData
   // Employer NI contribution: £{currencyFormat(calculateNI(inputState.pay * multiplier[inputState.payPeriod as keyof mult],inputState.category,employerData))}
    const months = ["Apr-22","May-22","Jun-22","Jul-22","Aug-22","Sep-22","Oct-22","Nov-22","Dec-22","Jan-23","Feb-23","Mar-23","Total"]
    if (bikType==="non-payrolled") {
      const nicD = months.map(el=>calculateNI(pay,category,employeeRates,false,el))[12]
      const nicC = (pay+bikValue)*0.1453
      const paye = calculatePayeTaxes(pay,jurisdiction)
      const bikTax = calculateBikTaxes(pay,bikValue,jurisdiction)
          const dir = window.innerWidth <=660 ? "column":"row"
      return (
        <Box>
          
           
        <TableContainer  component={Paper} style={dir=="column"?{width:"100%",marginLeft:"0px"}:{width:"100%",marginLeft:"60px"}}>
        <Table size="small" >
             <TableHead>
            <TableRow sx={{ border: 0,backgroundColor:"#D3D3D3",fontWeight:"bold",fontSize:"small" } }>
           
            <TableCell style={{fontWeight:"bold"}} align="left">{"PAYE Tax"}</TableCell> 
            <TableCell style={{fontWeight:"bold"}} align="left">{"Employee P11D Liability"}</TableCell> 
            <TableCell style={{fontWeight:"bold"}} align="left">{director? "Director's NIC":"Employee NI"}</TableCell> 
            <TableCell style={{fontWeight:"bold"}} align="left">{"Employer NI"}</TableCell> 
            
            </TableRow>
             </TableHead>
             <TableBody>
             
            <TableRow key={Math.random()*Math.random()*Math.random()}
            style={{width:'70%'}}
           
            >
      
             
           
              <TableCell style={{width:'25%'}} align="left">{currencyFormat(paye)}</TableCell>
              <TableCell style={{width:'25%'}} align="left">{currencyFormat(bikTax)}</TableCell>
              <TableCell style={{width:'25%'}} align="left">{currencyFormat(nicC) as string}</TableCell>
              <TableCell style={{width:'25%'}} align="left">{currencyFormat(nicD) as string}</TableCell>
              
             
            </TableRow>
          
          
             </TableBody>
             </Table>
             
        </TableContainer>
        </Box>
      )
    }
if(!director) {
    for (let i=0;i<months.length-1;i++) {    
      
            rows.push({"BIK":calculateBikTaxes(pay,bikValue,jurisdiction)/12,"paye":calculatePayeTaxes(pay,jurisdiction)/12,"employee":calculateNI(pay,category,employeeRates,false,months[i]), "employer":calculateNI(pay,category,employerData,false,months[i])+calculateNI(bikValue,category,employerData,true,months[i])})
    }
  } else {
    if (calculationType==="standard") {

        for (let i=0;i<months.length-1;i++) {   
          
          const dir = calculateDirectorNic(pay*(Math.max(i+1-firstPeriodPaid,0)),rates,i<=6?"first_period":"second_period",i>0?rows.reduce((a,b)=>a+b['employee'],0):0,proRata)
          const emp = calculateCompanyDirNic(pay*(Math.max(i+1-firstPeriodPaid,0)),rates,i<=6?"first_period":"second_period",i>0?rows.reduce((a,b)=>a+b['employer'],0):0,proRata)    
          rows.push({"employee":dir, "employer":emp})
    }
    //rows.push({"employee":calculateAnnualDirectorEmployeeNic(pay,directorRates), "employer":calculateAnnualDirectorCompanyNic(pay*12,directorRatesByCategory[category as keyof AnnualDirectorDataByCategory] )})
  } else {
    
    for (let i=0;i<months.length-2;i++) {  
    
      if (i<firstPeriodPaid) {
        rows.push({"employee":0,"employer":0})
       
      } else {
      rows.push({"employee":calculateNI(pay,category,employeeRates,false,months[i]), "employer":calculateNI(pay,category,employerData,false,months[i])})
      }
    }
    let totDir = 0;
    let totComp = 0;
    for (let i=0;i<months.length-1;i++) {   
      
      totComp+=calculateCompanyDirNic(pay*(Math.max(i+1-firstPeriodPaid,0)),rates,i<=6?"first_period":"second_period",i>0?totComp:0,proRata)    
      totDir+=calculateDirectorNic(pay*(Math.max(i+1-firstPeriodPaid,0)),rates,i<=6?"first_period":"second_period",i>0?totDir:0,proRata)
}
 
    //  rows.reduce((a,b)=>a+b['employee'],0)
    rows.push({"employee":totDir-rows.reduce((a,b)=>a+b['employee'],0),"employer":totComp-rows.reduce((a,b)=>a+b['employer'],0)})
    }

  }
    rows.push({"paye":rows.reduce((a,b)=>a+b["paye"],0),"BIK":rows.reduce((a,b)=>a+b["BIK"],0),"employee":rows.reduce((a,b)=>a+b["employee"],0),"employer":rows.reduce((a,b)=>a+b["employer"],0)})
    const dir = window.innerWidth <=660 ? "column":"row"
    return (
        
       
        <TableContainer  component={Paper} style={dir=="column"?{width:"100%",marginLeft:"0px"}:{width:"80%",marginLeft:"60px"}}>
        <Table size="small" >
             <TableHead>
            <TableRow >
            <TableCell  style={{fontWeight:"bold",fontSize:"small"}} align="left">Month</TableCell> 
            <TableCell style={{fontWeight:"bold",fontSize:"x-small"}} align="left">{"PAYE Tax"}</TableCell> 
            <TableCell style={{fontWeight:"bold",fontSize:"x-small"}} align="left">{"Tax on BIK"}</TableCell> 
            <TableCell style={{fontWeight:"bold",fontSize:"x-small"}} align="left">{director? "Director's NIC":"Employee NI"}</TableCell> 
            <TableCell style={{fontWeight:"bold",fontSize:"x-small"}} align="left">{"Employer NI"}</TableCell> 
            
            </TableRow>
             </TableHead>
             <TableBody>
             {rows.map((row,ind) => (
            <TableRow key={Math.random()*Math.random()*Math.random()}
            style={{width:'70%'}}
              sx={{ '&:last-child td, &:last-child th': { border: 0,backgroundColor:"#D3D3D3",fontWeight:"bold",fontSize:"small" } }}
            >
      
              <TableCell style={{width:'20%', fontSize:ind===12?"normal": "small"}} align="left">{months[ind]}</TableCell>
              <TableCell style={{width:'20%',fontSize:ind===12?"normal": "small"}} align="left">{currencyFormat((rows[ind])["paye"]) as string}</TableCell>
              <TableCell style={{width:'20%',fontSize:ind===12?"normal": "small"}} align="left">{currencyFormat((rows[ind])["BIK"]) as string}</TableCell>
              <TableCell style={{width:'20%',fontSize:ind===12?"normal": "small"}} align="left">{currencyFormat((rows[ind])["employee"]) as string}</TableCell>
              <TableCell style={{width:'20%',fontSize:ind===12?"normal": "small"}} align="left">{currencyFormat((rows[ind]["employer"])) as string}</TableCell>
              
             
            </TableRow>
          ))}
          
             </TableBody>
             </Table>
             
        </TableContainer>
  
    )
        
        

    
}
export const calculatePayeTaxes = (monthlyPay:number,jurisdiction:string):number=>{
  const rates = payeRatesList[jurisdiction as keyof PayeRatesJuris]
  const annualPay = monthlyPay * 12
  let res = 0
  for (let el of rates) {
    const taxable = Math.min(el.end-el.start,Math.max(annualPay-el.start,0))
    res+=taxable*el.rate
  }
  return res
}
export const calculateBikTaxes = (monthlyPay:number,bik:number,jurisdiction:string):number=>{
  const rates = payeRatesList[jurisdiction as keyof PayeRatesJuris]
  const annualPay = monthlyPay * 12
  bik=bik*12
  let res = 0
  let bikRes = 0
  for (let el of rates) {

    const taxablePaye = Math.min(el.end-el.start,Math.max(annualPay-el.start,0))
    res+=taxablePaye*el.rate
    const taxableBik = Math.min(el.end-el.start,Math.max(annualPay+bik-el.start,0))
    bikRes +=taxableBik*el.rate
   
  }
  return (bikRes-res)
}