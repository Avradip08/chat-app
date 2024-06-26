import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/user";
import { types } from "../utils/messagesTypes";

const Message = ({message}) => {
    const user = useRecoilValue(userAtom)
    if(message?.type===types.USER_JOINED){
        return <ActivityMessage message={user.userName===message?.payload?.userName ? "You have joined the chat" : `${message?.payload?.userName} has joined the chat`}/>
    }
    else if(message?.type===types.USER_LEFT){
        return <ActivityMessage message={user.userName===message?.payload?.userName ? "You have left the chat" : `${message?.payload?.userName} has left the chat`}/>
    }
    else if(message?.type===types.MESSAGE_RECEIVED && message?.payload?.userName === user.userName){
       return  <MyMessage message={message?.payload}/>
    }
    else if(message?.type===types.MESSAGE_RECEIVED && message?.payload?.userName !== user.userName){
        return <OtherMessage message={message?.payload} userName={message?.payload?.userName}/>
    }
}

export const OtherMessage = ({message,userName}) => {
    return (
        <div className="flex justify-start m-1">
            <div className={`p-2 flex flex-col border border-gray-400 bg-yellow-300 rounded-md shadow-xl`}>
                <div className="font-bold">{userName}</div>
                {
                    ProcessString(message?.message).map((m,i)=>{
                        return <div className="text-slate-700" key={i}>{m}</div>
                    })
                }
                <div className="text-xs font-light text-slate-600">
                    <span>{getTime(message?.timeStamp).time}</span>
                    <span>{", "}</span>
                    <span>{getTime(message?.timeStamp).date}</span>
                </div>
            </div>
        </div>
    )
}

export const MyMessage = ({message}) => {
    return (
        <div className="flex justify-end m-1">
            <div className={`p-2 flex flex-col border border-gray-400 bg-green-300 rounded-md shadow-xl`}>
                {
                    ProcessString(message?.message).map((m,i)=>{
                       return <div className="text-slate-700" key={i}>{m}</div>
                    })
                }
                <div className="text-xs font-light text-slate-600">
                    <span>{getTime(message?.timeStamp).time}</span>
                    <span>{", "}</span>
                    <span>{getTime(message?.timeStamp).date}</span>
                </div>
            </div>
        </div>
    )
}
export const ActivityMessage = ({message}) => {
    return (
        <div className="flex justify-center m-1">
            <div className="p-1 border border-gray-400 rounded-md shadow-xl bg-orange-200">
                {message}
            </div>
        </div>
    )
}

const ProcessString = (message) => {
    const lines = message.split('\n')
    const finalLines = []
    for(let i = 0; i < lines.length; i++){
        const words = lines[i].split(' ')
        let currLine = ''
        for(let j = 0; j < words.length; j++){ 
            let word = words[j]
            if(word.length>32){
                for(let k=0;k<word.length;k+=32){  
                    finalLines.push(word.substring(k,Math.min(k+32,word.length)))
                }
                continue
            } 
            if(word.length+currLine.length>32){
                finalLines.push(currLine)
                currLine = ''
            }
            currLine+=word+' '
        }
        if(currLine.length!==0){
            finalLines.push(currLine)
            currLine = ''
        }
    }
    return finalLines
}

const getTime = (dateString)=>{
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const day = date.getDate();
    return {
            time : `${hours}:${minutes}`,
            date : `${day}-${month}-${year}`
    }
}
export default Message