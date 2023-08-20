import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { useState } from 'react';
import axios from 'axios';
function SendMail() {
    
    const [text,setText]=useState('')
    const [data,setData]=useState([])
    const [header,setheader]=useState([])
    const [mailIdx,setMailidx]=useState([])
    // console.log(text)
    // console.log('data',data)

    var modifyText=(x)=>{
       
       var temp=text.trim().split('\n')
       var arrayTemp=[]
       for(var i=0;i<temp.length;i++)
       {
        temp[i].trim().split(' ').forEach((ii)=>arrayTemp.push(ii))
       }
       //console.log(arrayTemp)
       var mailContent=""
       var idx=0;
       arrayTemp.forEach((word)=>{

        if (word==header[idx]){
            mailContent+=x[idx]
            idx+=1
        }
        else{
            mailContent+=word
        }
        mailContent+=' '
       })
       return mailContent


        
    }
    var sendMail=async(ele,idx)=>{
      // console.log(ele)
      const mailObj={}
      mailObj.name=ele[1]
      mailObj.content=modifyText(ele)
      mailObj.email=ele[2]
      mailObj.subject=ele[3]
      // console.log("mail Object ",mailObj)
    if (mailIdx[idx]==false){
     var result=await axios.post('http://localhost:3000/sendEmail',mailObj)
     if(result.data.message==='Success') {
     var temp=mailIdx
      temp[idx]=true
      setMailidx([...temp])
     }
      console.log(mailIdx)
      console.log(result)
    }
  }
  console.log('data',data)
  console.log('headers',header)
    return ( 
<div  style={{margin:'50px'}}>
    {/* Excel reader */}
   <input type="file" onChange={(e)=>{
        const file=e.target.files[0]
        ExcelRenderer(file,(err,res)=>{
          if(err){
            alert(err)
          }
          else{
            setheader(res.rows[0])
            setData(res.rows.slice(1,))
            var x=res.rows.length
            var temp=[]
            for(var i=0;i<x;i++){
              temp.push(false)
            }
            setMailidx([...temp])
          }
        })
      }} style={{"padding":"10px"}} />

{/* Text Box */}
<div>
<textarea name="" id="" cols="30" rows="10" onChange={(e)=>{setText(e.target.value)}}></textarea>
</div>

{
    data.map((ele,idx)=>{
        if (idx!=0){
       
        return <div key={idx} class='d-flex justify-content-around'>
          <div>{ modifyText(ele)}</div>          
          <button onClick={()=>{sendMail(ele,idx)}}>Send Email</button>
          {mailIdx[idx]==false && <div>Did not send</div> }
          {mailIdx[idx]==true && <div>Sent Successfully</div> }
          </div>}
    })
}

<button onClick={()=>{
  
  data.map(async (ele,idx)=>{
      const mailObj={}
      mailObj.name=ele[1]
      mailObj.content=modifyText(ele)
      mailObj.email=ele[2]
      mailObj.subject=ele[3]
      // console.log("mail Object ",mailObj)
    if (mailIdx[idx]==false){
     var result=await axios.post('http://localhost:3000/sendEmail',mailObj)
     if(result.data.message==='Success') {
     var temp=mailIdx
      temp[idx]=true
      setMailidx([...temp])
     }
      console.log(mailIdx)
      console.log(result)
    }
    else{
      console.log("already mail sent to ",ele.name)
    }
})

}}>Send mail to every one </button>
</div>


     );
}

export default SendMail;