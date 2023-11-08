import {Button, Input, Divider} from "@nextui-org/react";
import {useState, useRef} from "react";
import {CLIENT_ID} from "@/config/constants";
import {DateTimeDuration} from "@internationalized/date";

interface CharacterTime {
    character: string;
    beginTime: number;
    endTime: number;
}

export default function IndexPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const characterTime = useRef<CharacterTime[]>([]);

    const actualCharacterBeginTime = useRef<Date>(new Date());


    const resetKeystrokeDynamics = () => {
        characterTime.current = [];
    }


    const login = async () => {
        if (username.length === 0) {
            alert("Please enter a username");
            return;
        }

        if (password.length === 0) {
            alert("Please enter a password");
            return;
        }


        const twoFactorPayload = {
            username,
            'characterTime': characterTime.current,
            'client_id': CLIENT_ID,
        }

        // TODO mock
        console.table(twoFactorPayload);
        const hash = 'ji@>sdj908u12ij1klma-asmcasijda=12asd@';
        console.log(hash);
        //

        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                hash
            })
        });
        const data = await res.json() as {
            token: string | undefined,
            message: string,
            success: boolean
        };

        if (data.success) {
            localStorage.setItem("token", data.token!);
            alert("Logged in successfully!");
        } else {
            alert(data.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full w-full">
            <div className="flex-col justify-center items-center">
                <div>
                    <Input type="text" label="Username" placeholder="Enter your username" labelPlacement="outside"
                           isClearable={true} description="Your username typing pattern will be used to identify you."
                           value={username}
                           onChange={(e) => {
                               setUsername(e.target.value);
                           }}
                           onClear={() => {
                               setUsername("");
                               resetKeystrokeDynamics();
                           }}
                           onKeyDown={async (e) => {
                               if (e.keyCode === 13) {
                                   await login();
                               }
                               // if backspace then reset and delete the whole array
                               actualCharacterBeginTime.current = new Date();
                           }
                           }
                           onKeyUp={async (e) => {
                               // get character Up
                               if (e.keyCode === 8) {
                                   resetKeystrokeDynamics();
                                   setUsername("");
                                   return;
                               }
                               const characterUp = e.key;
                               const actualTime = new Date();

                               characterTime.current.push({
                                   character: characterUp,
                                   beginTime: actualCharacterBeginTime.current.getTime(),
                                   endTime: actualTime.getTime(),
                               });
                           }}
                    />
                </div>
                <div className="mt-4 mb-4"/>
                <div>
                    <Input type="password" label="Password" placeholder="Enter your password"
                           labelPlacement="outside" isClearable={true} value={password}
                           onChange={(e) => setPassword(e.target.value)} onClear={() => setPassword("")}
                           onKeyDown={async (e) => {
                               if (e.keyCode === 13) {
                                   await login();
                               }
                           }}/>
                </div>
                <Divider className="mt-8 mb-8"/>
                <div className="flex flex-row gap-4 items-center justify-center">
                    <Button color="primary" className="text-white" onClick={login}>
                        Login
                    </Button>
                    <Button color="success" className="text-white">
                        Signup
                    </Button>
                </div>
            </div>
        </div>
    );
}
