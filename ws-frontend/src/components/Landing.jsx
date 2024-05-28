import {  useState } from "react"
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

const Landing = () =>{
    const [joinRoomId,setJoinRoomId]=useState('')
    const [createRoomId,setCreateRoomId]=useState('')
    const navigate = useNavigate()

    return (
        <div className="m-5">
            <div className="flex justify-center my-2">
                <h1 className="text-2xl font-extrabold text-slate-600">Welcome to group chat</h1>
            </div>
            <div className="flex justify-center my-2">
                <button disabled={joinRoomId!==''} className="p-1 w-40 bg-green-400 text-white font-extrabold text-xl rounded-lg shadow-lg disabled:bg-slate-500" onClick={()=>setCreateRoomId(uuid())}>Create Room</button>
                {
                    createRoomId!=='' &&
                    <div className="mx-3 font-bold text-xl">
                        Room Id : {createRoomId}
                    </div>
                }
            </div>
            <div className="flex justify-center my-2 gap-2">
                <label className="font-bold text-2xl">Join a room with id:</label>
                <input disabled={createRoomId!==''} className="w-60 border border-slate-500 rounded-md bg-slate-200 px-2" value={joinRoomId} onChange={(e)=>setJoinRoomId(e.target.value)}/>
                
            </div>
            <div className="flex justify-center my-2">
                <button hidden={createRoomId==='' && joinRoomId===''} className="w-[180px] h-[50px] rounded-md shadow-lg bg-red-600 text-white text-2xl font-extrabold"
                onClick={()=>{
                    if(createRoomId!==''){
                        navigate(`room/create/${createRoomId}`)
                    }
                    else if(joinRoomId!==''){
                        navigate(`room/join/${joinRoomId}`)
                    }
                }}
                >
                Start Chatting
                </button>
            </div>
        </div>
    )
}

export default Landing