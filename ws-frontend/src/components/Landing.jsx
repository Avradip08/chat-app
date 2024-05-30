import {  useState } from "react"
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import OldChats from "./Oldchats";
import { roomsOpenAtom } from "../store/rooms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios"
const Landing = () =>{
    const [joinRoomId,setJoinRoomId]=useState('')
    const [createRoomDetails,setCreateRoomDetails]=useState({
        id : uuid(), name:''
    })
    const [selection,setSelection] = useState({
        join : false, create : false
    })
    const [error,setError]=useState(null)
    const rooms = useRecoilValue(roomsOpenAtom)
    const setRooms = useSetRecoilState(roomsOpenAtom)
    const navigate = useNavigate()
    const handleJoinRoom = ()=>{
        //implement using db
        if(rooms.roomsOpen.has(joinRoomId)){
            setError('you are already present in the chat')
            return
        }
        let newRooms = rooms.roomsOpen
        newRooms.add(joinRoomId)
        setRooms({
            roomsOpen : newRooms
        })
        navigate(`../room/join/${joinRoomId}`)
    }
    const handleCreateRoom = async ()=>{
        const res = await axios.post('http://localhost:8080/api/roomExists',
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
        if(data?.roomExists){
            setError('please give a new room id')
            return
        }
        //implement using db
        if(rooms.roomsOpen.has(createRoomDetails.id)){
            setError('you are already present in the chat')
            return
        }
        let newRooms = rooms.roomsOpen
        newRooms.add(createRoomDetails.id)
        setRooms({
            roomsOpen : newRooms
        })
        navigate(`../room/create/${createRoomDetails.id}`)
    }
    return (
        <div className="m-5 font-mono">
            <div className="flex justify-center my-2">
                <h1 className="text-2xl font-extrabold">Welcome</h1>
            </div>
            <div className="flex justify-center my-2 gap-2">
                <span>
                    <h1>Join Room</h1>
                </span>
                <span>
                    <input className="" type="checkbox" name="join" id="join" checked={selection.join} onChange={
                        ()=>{
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
                <div className="flex justify-center my-2">
                    <div className="flex flex-col items-center justify-center my-2 gap-2">
                        <input placeholder="Enter Room ID*" className="border border-black w-60 rounded-md shadow-sm p-1" value={joinRoomId} onChange={(e)=>{
                            setJoinRoomId(e.target.value)
                        }}/>
                        {   error!==null &&
                            <p className="text-red-500 text-sm">{error}</p>
                        }
                        <button className="text-white bg-black w-60 rounded-md shadow-sm p-2" onClick={handleJoinRoom}>JOIN ROOM</button>
                    </div>
                </div>
            }
            {   selection.create===true &&
                <div className="flex justify-center my-2">
                    <div className="flex flex-col items-center justify-center my-2 gap-2">
                        <input className="border border-black w-60 rounded-md shadow-sm p-1" value={createRoomDetails.id} onChange={(e)=>{
                            setCreateRoomDetails({
                                id : e.target.value, name : createRoomDetails.name
                            })
                        }}/>
                        <input placeholder="Enter Room Name*" className="border border-black w-60 rounded-md shadow-sm p-1" value={createRoomDetails.name} onChange={(e)=>{
                            setCreateRoomDetails({
                                id : createRoomDetails.id, name : e.target.value
                            })
                        }}/>
                        {   error!==null &&
                            <p className="text-red-500 text-sm">{error}</p>
                        }
                        <button className="text-white bg-black w-60 rounded-md shadow-sm p-2" onClick={handleCreateRoom}>CREATE ROOM</button>
                    </div>
                </div>  
            }
            <div className="flex justify-center my-2">
                <OldChats/>
            </div>
        </div>
    )
}

export default Landing