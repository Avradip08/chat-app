import {  useState } from "react"
import { v4 as uuid } from "uuid";
import OldChats from "./Oldchats";
import { API_URL } from "../utils/constants";
import axios from "axios"
import { useSetRecoilState } from "recoil";
import { errorAtom } from "../store/error";
import LandingRoom from "./LandingRoom";
const Landing = () =>{
    const [joinRoomId,setJoinRoomId]=useState('')
    const [createRoomDetails,setCreateRoomDetails]=useState({
        id : uuid(), name:''
    })
    const [selection,setSelection] = useState({
        join : true, create : false
    })
    const [roomIdLand,setRoomIdLand] = useState(null);
    const [roomType,setRoomType] = useState(null);
    const setError=useSetRecoilState(errorAtom)
    const handleJoinRoom =async ()=>{
        setError(null)
        //implement using db
        const res = await axios.post(`${API_URL}/userActive`,
            {
                roomId : joinRoomId
            },
            {
                headers : {
                    Authorization : 'Bearer ' + localStorage.getItem('token')
                }
            }
        )
        const data = res?.data
        
        //check if the user is already present in the room he wants to join
        if(data?.userActive===true){
            setError('you are already present in the room')
            return
        }
        // window.open(`../room/join/${joinRoomId}`, '_blank', 'rel=noopener noreferrer')
        // navigate(`../room/join/${joinRoomId}`)
        setRoomIdLand(joinRoomId);
        setRoomType('join');
    }
    const handleCreateRoom = async ()=>{
        setError(null)
        const res = await axios.post(`${API_URL}/roomExists`,
            {
                roomId : createRoomDetails.id
            },
            {
                headers : {
                Authorization : "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
              }
            })
        const data = res?.data

        //check if the roomId is already present in the database
        if(data?.roomExists){
            setError('please enter a new room id')
            return
        }
        // window.open(`../room/create/${createRoomDetails.id}`, '_blank', 'rel=noopener noreferrer')
        // navigate(`../room/create/${createRoomDetails.id}`)
        setRoomIdLand(createRoomDetails.id);
        setRoomType('create');
    }
    return (
        <div className="flex">
        <div className="flex justify-start h-[92%]">
            <div className="font-mono ">
                <div className="flex flex-col relative  mx-5">
                    <div className="flex-1 h-[29vh]">
                        <div className="flex justify-center mb-2 gap-2">
                        <span>
                            <h1>Join Room</h1>
                        </span>
                        <span>
                            <input className="" type="checkbox" name="join" id="join" checked={selection.join} onChange={
                                ()=>{
                                    setError(null)
                                    if(selection.join===false){
                                        setJoinRoomId('')
                                    }
                                    setSelection(prev=>{
                                        if(prev.join===true){
                                            return {
                                                join : false, create : prev.create
                                            }
                                        }
                                        else if(prev.join===false){
                                            return {
                                                join : true, create : false
                                            }
                                        }
                                    })
                                }
                            }/>
                        </span>
                        <span>
                            <h1>/</h1>
                        </span>
                        <span>
                            <h1>Create Room</h1>
                        </span>
                        <span>
                            <input className="" type="checkbox" name="create" id="create" checked={selection.create} onChange={
                                ()=>{
                                    setError(null)
                                    if(selection.create===false){
                                        setCreateRoomDetails({
                                            id : uuid(), name:''
                                        })
                                    }
                                    setSelection(prev=>{
                                        if(prev.create===true){
                                            return {
                                                create : false, join : prev.join
                                            }
                                        }
                                        else if(prev.create===false){
                                            return {
                                                create : true, join : false
                                            }
                                        }
                                    })
                                }
                            }/>
                        </span>
                    </div>
                    {   selection.join===true &&
                        <div className="flex justify-center mb-2">
                            <div className="flex flex-col items-center justify-center  gap-2">
                                <input placeholder="Enter Room ID*" className="border border-black w-80 rounded-md shadow-sm p-1" value={joinRoomId} onChange={(e)=>{
                                    setJoinRoomId(e.target.value)
                                }}/>
                                <button className="text-white bg-black w-80 rounded-md shadow-sm p-2" onClick={handleJoinRoom}>JOIN ROOM</button>
                            </div>
                        </div>
                    }
                    {   selection.create===true &&
                        <div className="flex justify-center mb-2">
                            <div className="flex flex-col items-center justify-center  gap-2">
                                <input className="border border-black w-80 rounded-md shadow-sm p-1" value={createRoomDetails.id} onChange={(e)=>{
                                    setCreateRoomDetails({
                                        id : e.target.value, name : createRoomDetails.name
                                    })
                                }}/>
                                <input placeholder="Enter Room Name*" className="border border-black w-80 rounded-md shadow-sm p-1" value={createRoomDetails.name} onChange={(e)=>{
                                    setCreateRoomDetails({
                                        id : createRoomDetails.id, name : e.target.value
                                    })
                                }}/>
                                <button className="text-white bg-black w-80 rounded-md shadow-sm p-2" onClick={handleCreateRoom}>CREATE ROOM</button>
                            </div>
                        </div>  
                    }
                    </div>
                </div>
                <div className="flex justify-center mb-2">
                    <h1 className="font-bold text-xl">All Chats</h1>
                </div>
                <div className="h-[59vh] relative flex flex-col">
                    <div className="flex-1 overflow-y-scroll">
                        <div className="flex justify-center mb-2">
                            <OldChats setType={setRoomType} setRoomId={setRoomIdLand}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="ml-20">
            <LandingRoom type={roomType} roomId={roomIdLand} setRoomId={setRoomIdLand}/>
        </div>
        </div>
    )
}

export default Landing